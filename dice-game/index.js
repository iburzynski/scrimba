class Game {
  constructor() {
    // Initialize game
    this.gameOver = false;
    this.player1Turn = this.coinFlip();
    this.p1 = new Player(1);
    this.p2 = new Player(2);
    // Set DOM elements
    this.message = document.getElementById("message");
    this.rollBtn = document.getElementById("rollBtn");
    this.rollBtn.addEventListener("click", () => {
      this.player1Turn
        ? this.turn(this.p1, this.p2)
        : this.turn(this.p2, this.p1);
    });
    this.resetBtn = document.getElementById("resetBtn");
    this.resetBtn.addEventListener("click", () => this.reset());
    this.setActivePlayer();
  }
  coinFlip() {
    return Math.round(Math.random());
  }
  setActivePlayer() {
    const activePlayer = this.player1Turn ? this.p1 : this.p2;
    activePlayer.dice.classList.add("active");
    this.message.textContent = `${activePlayer.name}'s Turn`;
  }
  turn(player, opponent) {
    const randomNumber = Math.ceil(Math.random() * 6);
    player.dice.textContent = randomNumber;
    player.dice.classList.remove("active");

    player.score += randomNumber;
    player.scoreboard.textContent = player.score;

    this.gameOver = player.score > 19;
    if (this.gameOver) {
      this.switchButtons();
    } else {
      opponent.dice.classList.add("active");
      this.player1Turn = !this.player1Turn;
    }

    this.message.textContent = this.gameOver
      ? `${player.name} has won! ${player.emoji}`
      : `${opponent.name} Turn`;
  }
  switchButtons() {
    if (this.gameOver) {
      this.rollBtn.style.display = "none";
      this.resetBtn.style.display = "block";
    } else {
      this.rollBtn.style.display = "block";
      this.resetBtn.style.display = "none";
    }
  }
  reset() {
    this.gameOver = false;
    this.player1Turn = this.coinFlip();
    this.p1.reset();
    this.p2.reset();
    this.switchButtons();
    this.setActivePlayer();
  }
}

class Player {
  constructor(number) {
    this.number = number;
    this.name = `Player ${this.number}`;
    this.score = 0;
    this.dice = document.getElementById(`player${this.number}Dice`);
    this.scoreboard = document.getElementById(`player${this.number}Scoreboard`);
    this.emoji = this.number === 1 ? "🥳" : "🎉";
  }
  reset() {
    this.score = 0;
    this.dice.textContent = "-";
    this.dice.classList.remove("active");
    this.scoreboard.textContent = 0;
  }
}

// Start Game
const game = new Game();
