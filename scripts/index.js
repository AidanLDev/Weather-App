const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;
let selectedSolIndex;

const previousWeatherToggle = document.querySelector('.show-previous-weather');
const previousWeather = document.querySelector('.previous-weather');

// Current sol
const currentSolEl = document.querySelector('[data-current-sol]');
const currentDateEl = document.querySelector('[data-current-date]');
const currentTempHighEl = document.querySelector('[data-current-tmp-high]');
const currentTempLowEl = document.querySelector('[data-current-tmp-low]');
const currentWindSpeedEl = document.querySelector('[data-wind-speed]');
const currentWindDirectionTextEl = document.querySelector(
  '[data-wind-direction-text]'
);
const currentWindDirectionArrowEl = document.querySelector(
  '[data-wind-direction-arrow]'
);

// Previous sols
const previousSolTemplate = document.querySelector(
  '[data-previous-sol-template]'
);
const previousSolContainer = document.querySelector('[data-previous-sols]');

previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather');
});

function getWeather() {
  return fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...weatherData } = data;
      /*  ...weatherData just gets everything that isn't sol_keys or validity_checks as I won't be using that data  */
      return Object.entries(weatherData).map(([key, data]) => {
        const temp = data.AT;
        const WD = data.WD;
        return {
          sol: key,
          earthDate: new Date(data.First_UTC),
          tempAvg: temp.av,
          tempHigh: temp.mx,
          tempLow: temp.mn,
          windSpeed: data.HWS.av,
          compassPoint: WD.most_common.compass_point,
          windDegrees: WD.most_common.compass_degrees,
        };
      });
    });
}

function displaySelectedSol(sols) {
  const selectedSol = sols[selectedSolIndex];
  currentSolEl.innerHTML = selectedSol.sol;
  currentDateEl.innerHTML = formatDate(selectedSol.earthDate);
  currentTempHighEl.innerHTML = formatTemp(selectedSol.tempHigh);
  currentTempLowEl.innerHTML = formatTemp(selectedSol.tempLow);
  currentWindSpeedEl.innerHTML = formatSpeed(selectedSol.windSpeed);
  currentWindDirectionArrowEl.style.setProperty(
    '--direction',
    `${selectedSol.windDegrees}deg`
  );
  currentWindDirectionTextEl.innerHTML = selectedSol.windDegrees;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
}

function formatTemp(tmp) {
  return Math.round(tmp);
}

function formatSpeed(speed) {
  return Math.round(speed);
}

function displayPreviousSols(sols) {
  previousSolContainer.innerHTML = '';
  sols.forEach((solData, index) => {
    // take everything in the sol container
    const solContainer = previousSolTemplate.content.cloneNode(true);
    solContainer.querySelector('[data-sol]').innerHTML = solData.sol;
    solContainer.querySelector('[data-date]').innerHTML = formatDate(
      solData.earthDate
    );
    solContainer.querySelector('[data-tmp-high]').innerHTML = formatTemp(
      solData.tempHigh
    );
    solContainer.querySelector('[data-tmp-low]').innerHTML = formatTemp(
      solData.tempLow
    );
    solContainer
      .querySelector('[data-select-button]')
      .addEventListener('click', () => {
        selectedSolIndex = index;
        displaySelectedSol(sols);
      });

    previousSolContainer.appendChild(solContainer);
  });
}

getWeather().then((sol) => {
  // Get the last sol in the array
  selectedSolIndex = sol.length - 1;
  displaySelectedSol(sol);
  displayPreviousSols(sol);
});
