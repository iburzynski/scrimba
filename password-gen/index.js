function genPasswords(num, length, excludeChars = []) {
  const range = makeAsciiRange(excludeChars);
  return [...Array(num).keys()].map((_) => genPassword(length, range));
}

function makeAsciiRange(excludeChars = []) {
  const range = [...Array(94).keys()].reduce((acc, x) => {
    const char = String.fromCharCode(x + 33);
    return !excludeChars.includes(char) ? [...acc, char] : acc;
  }, []);
  return range;
}

function genPassword(length, range) {
  return [...Array(length).keys()].map(getPassChar(range)).join("");
}

function getPassChar(chars) {
  return function (_) {
    const idx = Math.floor(Math.random() * chars.length);
    return chars[idx];
  };
}

function getExcludeChars() {
  return document.getElementById("exclude").value;
}

function populatePasswords(container, num) {
  const [len, exc] = ["length", "exclude"].map(
    (e) => document.getElementById(e).value
  );
  const excChars = exc.split("");
  const pws = genPasswords(num, Number(len), excChars);
  pws.forEach(pw => {
    container.append(createPWDiv(pw))
  });
}

function createPWDiv(pw) {
  const pwDiv = document.createElement("div");
  const pwInput = document.createElement("input");

  pwDiv.className = "password";
  pwInput.setAttribute("value", pw);
  pwInput.setAttribute("disabled", true);
  pwInput.setAttribute("id", pw);
  pwDiv.addEventListener("click", () => {
    const copyText = document.getElementById(pw);
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value);
    alert("Copied Password!");
  })
  pwDiv.append(pwInput);
  return pwDiv;
}

function clearPasswords(container) {
  container.innerHTML = "";
}

(function init() {
  const container = document.getElementById("pw-container");
  const popBtn = document.getElementById("populate-btn");
  const moreBtn = document.getElementById("more-btn");
  popBtn.addEventListener("click", () => {
    clearPasswords(container);
    populatePasswords(container, 4);
    moreBtn.classList.remove("hidden");
  });
  moreBtn.addEventListener("click", () => {
    populatePasswords(container, 2);
  });
})();