function render(elem, storage, callback, movies) {
  elem.innerHTML = movies.map(getMovieHtml(storage)).join("");
  movies.map(addWatchlistListener(storage, callback));
}

function addWatchlistListener(storage, callback) {
  return function (movie) {
    const id = movie.imdbID;
    const listener = {};
    listener[id] = document
      .getElementById(id)
      .addEventListener("click", callback(storage, movie));
    return listener;
  };
}

function getMovieHtml(storage) {
  return function (movie) {
    const { Poster, Title, Year, imdbRating, Runtime, Genre, Plot, imdbID } =
      movie;
    const [symbol, label] = storage.getItem(imdbID)
      ? ["-", "Remove"]
      : ["+", "Watchlist"];
    const html = `<div class="movie" id="movie-${imdbID}">
        <div class="movie__poster">
            <img src="${Poster}" alt="${Title} (${Year})"/>
        </div>
        <div class="movie__info">
            <h2 class="movie__title">${Title} (${Year})
              <span class="movie__rating">${imdbRating}</span>
            </h2>
            <div class="movie__infobar">
              <p class="movie__runtime">${Runtime}</p>
              <p class="movie__genre">${Genre}</p>
              <p class="movie__add" id="toggle-${imdbID}">
                <button id="${imdbID}">${symbol}</button>
                <span>${label}</span>
              </p>
            </div>
            <p class="movie__plot">${Plot}</p>
        </div>
      </div>`;
    return html;
  };
}

export { render };
