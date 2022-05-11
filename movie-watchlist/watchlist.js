import { render } from "./utils.js";

function getStorageItems(storage) {
  const keys = [...Object.keys(storage)];
  return keys.map((key) => {
    const str = `${storage.getItem(key)}`;
    return JSON.parse(str);
  });
}

function removeMovie(storage, movie) {
  return function () {
    const id = movie.imdbID;
    storage.removeItem(id);
    document.getElementById(`movie-${id}`).remove();
  }
}

(function init() {
  const main = document.getElementsByTagName("main")[0];
  const movies = getStorageItems(localStorage);
  console.log(movies);
  render(main, localStorage, removeMovie, movies);
})();


