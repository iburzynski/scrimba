class Game {
  constructor(layout) {
    this.layout = layout;
    this.width = Math.sqrt(layout.length);
    this.ghosts = [
      new Ghost("blinky", 348, 250),
      new Ghost("pinky", 376, 400),
      new Ghost("inky", 351, 300),
      new Ghost("clyde", 379, 500),
    ];
    this.squares = this.createBoard();
    this.moved = function (event) {
      this.control(event);
    };
    this.keyHandler = this.moved.bind(this);
    window.addEventListener("keyup", this.keyHandler);
    this.ghosts.forEach((ghost) => this.moveGhost(ghost));
    this.scoreDisplay = document.getElementById("score");
    this.score = 0;
    this.pacmanCurrentIndex = 490;
    this.squares[this.pacmanCurrentIndex].classList.add("pacman");
    this.keyOps = {
      ArrowUp: () =>
        this.pacmanCurrentIndex - this.width >= 0
          ? this.pacmanCurrentIndex - this.width
          : this.width ** 2 + (this.pacmanCurrentIndex - this.width),
      ArrowDown: () =>
        this.pacmanCurrentIndex + this.width < this.width ** 2
          ? this.pacmanCurrentIndex + this.width
          : (this.pacmanCurrentIndex + this.width) % this.width ** 2,
      ArrowLeft: () =>
        this.pacmanCurrentIndex % this.width !== 0
          ? this.pacmanCurrentIndex - 1
          : this.pacmanCurrentIndex + this.width - 1,
      ArrowRight: () =>
        this.pacmanCurrentIndex % this.width < this.width - 1
          ? this.pacmanCurrentIndex + 1
          : this.pacmanCurrentIndex - this.width + 1,
    };
  }
  createBoard() {
    function createSquare(elem) {
      const square = document.createElement("div");
      switch (elem) {
        case 0:
          square.classList.add("pac-dot");
          break;
        case 1:
          square.classList.add("wall");
          break;
        case 2:
          square.classList.add("ghost-lair");
          break;
        case 3:
          square.classList.add("power-pellet");
          break;
      }
      return square;
    }
    const grid = document.querySelector(".grid");
    const squares = this.layout.map(createSquare);
    squares.forEach((square) => grid.appendChild(square));
    this.ghosts.forEach((ghost) => {
      squares[ghost.currentIndex].classList.add("ghost", ghost.className);
    });
    return squares;
  }
  control(e) {
    // rename IE arrow keys
    const keyCopy = ["Up", "Down", "Left", "Right"].includes(e.key)
      ? "Arrow" + e.key
      : e.key;
    // if key is an arrow
    if (Object.keys(this.keyOps).includes(keyCopy)) {
      // get new index
      const newIndex = this.keyOps[keyCopy].bind(this)();
      console.log(newIndex);
      // update DOM if new index not wall or ghost lair
      if (![1, 2].includes(this.layout[newIndex])) {
        this.squares[this.pacmanCurrentIndex].classList.remove("pacman");
        this.pacmanCurrentIndex = newIndex;
        this.squares[this.pacmanCurrentIndex].classList.add("pacman");
        this.pacDotEaten();
        this.powerPelletEaten();
        this.gameOver();
      }
    }
  }
  updateScore(increment) {
    this.score += increment;
    this.scoreDisplay.innerText = this.score;
  }
  pacDotEaten() {
    if (this.squares[this.pacmanCurrentIndex].classList.contains("pac-dot")) {
      this.squares[this.pacmanCurrentIndex].classList.remove("pac-dot");
      this.updateScore(1);
    }
  }
  powerPelletEaten() {
    if (
      this.squares[this.pacmanCurrentIndex].classList.contains("power-pellet")
    ) {
      this.updateScore(10);
      this.squares[this.pacmanCurrentIndex].classList.remove("power-pellet");
      this.ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(
        function () {
          this.ghosts.forEach((ghost) => (ghost.isScared = false));
        }.bind(this),
        10000
      );
    }
  }
  moveGhost(ghost) {
    function randomDirection() {
      const directions = [-1, +1, -this.width, +this.width];
      return directions[Math.floor(Math.random() * directions.length)];
    }
    let direction = randomDirection.bind(this)();

    ghost.timerId = setInterval(
      function () {
        const currentSquare = this.squares[ghost.currentIndex].classList;
        const nextSquare =
          this.squares[ghost.currentIndex + direction].classList;
        if (!nextSquare.contains("ghost") && !nextSquare.contains("wall")) {
          currentSquare.remove("ghost", ghost.className, "scared-ghost");
          nextSquare.add("ghost", ghost.className);
          ghost.currentIndex += direction;
        } else {
          direction = randomDirection.bind(this)();
        }
        if (ghost.isScared) {
          this.squares[ghost.currentIndex].classList.add("scared-ghost");
          if (this.squares[ghost.currentIndex].classList.contains("pacman")) {
            this.squares[ghost.currentIndex].classList.remove(
              "ghost",
              "scared-ghost",
              ghost.className
            );
            ghost.currentIndex = ghost.startIndex;
            this.squares[ghost.currentIndex].classList.add(
              "ghost",
              ghost.className
            );
            this.updateScore(100);
          }
        }
        this.gameOver();
      }.bind(this),
      ghost.speed
    );
  }
  stopGame(message) {
    this.ghosts.forEach((ghost) => clearInterval(ghost.timerId));
    window.removeEventListener("keyup", this.keyHandler);
    this.updateScore(` -- ${message}`);
  }
  gameOver() {
    const currentSquare = this.squares[this.pacmanCurrentIndex].classList;
    if (
      currentSquare.contains("ghost") &&
      !currentSquare.contains("scared-ghost")
    ) {
      this.stopGame("You lose!");
    } else if (
      this.score > 274 &&
      this.squares.filter(
        (square) =>
          square.classList.contains("pac-dot") ||
          square.classList.contains("power-pellet")
      ).length === 0
    ) {
      this.stopGame("You win!");
    }
  }
}

class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className;
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerId = NaN;
  }
}
// 0 - pacdots
// 1 - wall
// 2 - ghost lair
// 3 - powerpellets
// 4 - empty

const layout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0,
  1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1,
  1, 0, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
  4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4,
  4, 4, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1,
  1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1,
];

const game = new Game(layout);
