import { render } from "./utils.js";

(function init() {
  const apiUrl = "http://www.omdbapi.com/?apikey=440c1ac7";
  const searchButton = document.getElementById("search");
  const main = document.getElementsByTagName("main")[0];
  searchButton.addEventListener("click", () => {
    searchButton.innerText = "Searching...";
    searchButton.disabled = true;
    const title = document.getElementById("movie-title").value;
    fetchMovieResults(apiUrl, title).then((movies) => {
      render(main, localStorage, toggleMovie, movies);
      searchButton.innerText = "Search";
      searchButton.disabled = false;
    });
    document.getElementById("movie-title").value = "";
  });
})();

function toggleMovie(storage, movie) {
  return function () {
    const id = movie.imdbID;
    if (!storage.getItem(id)) {
      storage.setItem(id, JSON.stringify(movie));
    } else {
      storage.removeItem(id);
    }
    const toggle = document.getElementById(`toggle-${id}`);
    toggleWatchlistButton(toggle);
  };
}

function toggleWatchlistButton(toggle) {
  const [button, label] = toggle.children;
  button.innerText = button.innerText == "+" ? "-" : "+";
  label.innerText = label.innerText == "Watchlist" ? "Remove" : "Watchlist";
}

async function fetchMovieResults(apiUrl, title) {
  const titleSlug = title.replace(" ", "+");
  const res = await fetch(`${apiUrl}&s=${titleSlug}`);
  const movies = await res.json();
  return Promise.all(
    movies.Search.map((movie) => fetchMovieData(apiUrl)(movie.imdbID))
  );
}

function fetchMovieData(apiUrl) {
  return async function (movieId) {
    const res = await fetch(`${apiUrl}&i=${movieId}`);
    const movieData = await res.json();
    return movieData;
  };
}