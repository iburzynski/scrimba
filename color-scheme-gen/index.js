(function init() {
  const [seedInput, getSchemeBtn] = ["scheme-seed", "get-scheme"].map((i) =>
    document.getElementById(i)
  );
  const [seedVal, mode] = getInputVals();
  renderScheme(seedVal, mode);
  let schemeBtnMouseover = setSchemeBtnListener("mouseover", seedVal);
  setSchemeBtnListener("mouseout", getSchemeBtn.style.background);
  seedInput.addEventListener("input", () => {
    getSchemeBtn.removeEventListener("mouseover", schemeBtnMouseover);
    schemeBtnMouseover = setSchemeBtnListener(
      "mouseover",
      getInputVal("scheme-seed")
    );
  });

  getSchemeBtn.addEventListener("click", () => {
    const [seed, mode] = getInputVals();
    renderScheme(seed, mode);
  });

  // helper functions:
  function getInputVals() {
    return ["scheme-seed", "scheme-mode"].map(getInputVal);
  }
  function getInputVal(input) {
    return document.getElementById(input).value;
  }
  function setSchemeBtnListener(type, hex) {
    return getSchemeBtn.addEventListener(
      type,
      () => (getSchemeBtn.style.background = hex)
    );
  }
})();

async function fetchColorsArr(seed, mode) {
  const validSeed = seed[0] === '#' ? seed.slice(1) : seed;
  const colorResp = await fetch(
    `https://www.thecolorapi.com/scheme?hex=${validSeed
    }&mode=${mode.toLowerCase()}`
  );
  const colorJson = await colorResp.json();
  const colorsArr = Object.values(colorJson.colors).map(
    (color) => color.hex.value
  );
  return colorsArr;
}

function getSchemeHtml(colors) {
  const barsHtml = colors
    .map(
      (hex) => `<div class="color-bar" style="background-color: ${hex};"></div>`
    )
    .join("");
  const labelsHtml = colors
    .map((hex) => `<input class="color-label" value="${hex}" readonly>`)
    .join("");
  return `${barsHtml}${labelsHtml}`;
}

function renderScheme(seed, mode) {
  fetchColorsArr(seed, mode).then((res) => {
    document.getElementsByTagName("main")[0].innerHTML = getSchemeHtml(res);
    const labels = Array.from(document.getElementsByClassName("color-label"));
    labels.forEach((label) =>
      label.addEventListener("click", () => {
        console.log(label);
        label.select();
        label.setSelectionRange(0, 99999); /* For mobile devices */
        navigator.clipboard.writeText(label.value);
        alert("Copied hex value!");
      })
    );
  });
}
