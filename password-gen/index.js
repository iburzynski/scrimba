(function init() {
  const [min, max] = [10, 20];
  const [cont, pop, more, len, exc, err] = [
    "pw-container",
    "populate-btn",
    "more-btn",
    "length",
    "exclude",
    "error",
  ].map((e) => document.getElementById(e));
  len.setAttribute("min", min);
  len.setAttribute("max", max);
  len.addEventListener("input", () => {
    toggleButtons([pop, more], err, min, max, len.value);
  });
  pop.addEventListener("click", () => {
    cont.innerHTML = "";
    populatePasswords(cont, len, exc, 4);
    more.classList.remove("hidden");
  });
  more.addEventListener("click", () => {
    populatePasswords(cont, len, exc, 2);
  });
})();

function toggleButtons(btns, err, min, max, val) {
  const valid = isValidLength(min, max, val);
  btns.forEach((btn) => {
    if (btn.hasAttribute("disabled") && valid) {
      btn.removeAttribute("disabled");
      err.innerText = "";
    } else if (!valid) {
      btn.setAttribute("disabled", true);
      err.innerText = `Password must be ${min} to ${max} characters!`;
    }
  });
  function isValidLength(min, max, val) {
    return val >= min && val <= max;
  }
}

function populatePasswords(container, len, exc, num) {
  const excChars = exc.value.split("");
  const pws = genPasswords(num, Number(len.value), excChars);
  pws.forEach((pw) => {
    container.append(createPWDiv(pw));
  });
}

function createPWDiv(pw) {
  const pwDiv = document.createElement("div");
  const pwInput = document.createElement("input");

  pwDiv.className = "password";
  [
    ["value", pw],
    ["disabled", true],
    ["id", pw],
  ].forEach((args) => {
    pwInput.setAttribute(...args);
  });
  pwDiv.addEventListener("click", () => {
    const copyText = document.getElementById(pw);
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(copyText.value);
    alert("Copied Password!");
  });
  pwDiv.append(pwInput);
  return pwDiv;
}

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
