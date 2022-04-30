(function init() {
  const input = document.getElementById("number");
  const equations = Object.freeze({
    feet: (m) => 3.28084 * m,
    meters: (f) => 0.3048 * f,
    gallons: (l) => 0.2199692 * l,
    liters: (g) => 4.54609 * g,
    pounds: (k) => 2.204623 * k,
    kilos: (p) => 0.4535924 * p,
    celsius: (f) => (f - 32) * (5 / 9),
    fahrenheit: (c) => c * (9 / 5) + 32,
  });
  const units = Object.freeze({
    temperature: {
      metric: ["celsius", "celsius"],
      imperial: ["fahrenheit", "fahrenheit"],
    },
    length: {
      metric: ["meter", "meters"],
      imperial: ["foot", "feet"],
    },
    volume: {
      metric: ["liter", "liters"],
      imperial: ["gallon", "gallons"],
    },
    mass: {
      metric: ["kilo", "kilos"],
      imperial: ["pound", "pounds"],
    },
  });
  input.addEventListener("input", () => updateDOM(equations, units, input));
  updateDOM(equations, units, input);
})();

function updateDOM(eqns, units, input) {
  const number = input.value ? input.value : 0;
  const converted = convertUnits(eqns, number);
  const conversion = genConversionFunc(converted);
  const f = genMeasureFunc(units)(conversion);
  Object.keys(units).map(f).forEach(
    ({ type, metric, imperial }) => {
      if (type == "temperature") {
        metric = replaceTempLabels(metric);
        imperial = replaceTempLabels(imperial);
      }
      document.getElementById(type + "-m").innerHTML = metric;
      document.getElementById(type + "-i").innerHTML = imperial;
    }
  );
}

function convertUnits(eqns, number) {
  const converted = { number };
  Object.keys(eqns).forEach((unit) => {
    converted[unit] = parseFloat(eqns[unit](number).toFixed(3));
  });
  return Object.freeze(converted);
}

function genConversionFunc(conv) {
  return function (unitsM, unitsI) {
    const unitI = conv.number == 1 || conv.number == -1 ? unitsI[0] : unitsI[1];
    const unitM = conv.number == 1 || conv.number == -1 ? unitsM[0] : unitsM[1];
    const convI = conv[unitsI[1]];
    const convM = conv[unitsM[1]];
    const unitI2 = convI == 1 ? unitsI[0] : unitsI[1];
    const unitM2 = convM == 1 ? unitsM[0] : unitsM[1];
    const metric = `${conv.number} ${unitM} = ${convI} ${unitI2}`;
    const imperial = `${conv.number} ${unitI} = ${convM} ${unitM2}`;
    return [metric, imperial];
  };
}

function genMeasureFunc(units) {
  return function (func) {
    return function (type) {
      const [metric, imperial] = func(units[type].metric, units[type].imperial);
      return { type, metric, imperial };
    };
  };
}

function replaceTempLabels(str) {
  return str.replace("fahrenheit", "°F").replace("celsius", "°C");
}