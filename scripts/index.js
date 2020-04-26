const API_KEY = 'DEMO_KEY';
const API_URL = `https://api.nasa.gov/insight_weather/?api_key=${API_KEY}&feedtype=json&ver=1.0`;

const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather');

previousWeatherToggle.addEventListener('click', () => {
  previousWeather.classList.toggle('show-weather');
});

function getWeather() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { sol_keys, validity_checks, ...weatherData } = data;
      /*  ...weatherData just gets everything that isn't sol_keys or validity_checks as I won't be using that data  */
      const tmp = Object.entries(weatherData).map(([key, data]) => {
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
      console.log(tmp);
      console.log(weatherData);
    });
}

getWeather();
