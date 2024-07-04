const countriesSection = document.getElementById("countries-sec");
const searchInput = document.getElementById("search-input");
const btnNameFilter = document.getElementById("btn-name-filter");
const btnCapitalFilter = document.getElementById("btn-capital-filter");
const btnPopFilter = document.getElementById("btn-pop-filter");
const btnPopulation = document.getElementById("btn-population");
const popSection = document.getElementById("population-sec");
const populationBar = document.getElementById("population-bar");

let countriesArray = [];
let isSorted = false;

fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    countriesArray = data;
    displayCountries(countriesArray);
  });

const displayCountries = (country) => {
  countriesSection.innerHTML = country
    .map((country) => {
      const languages = Object.values(country.languages || {}).join(", ");
      return `
            <div class="country-div" id="country-div">
                <div class="flag-name" id="flag-name">
                    <img src="${country.flags.png}" alt="" class="flag-img" id="flag-img">
                    <h3 class="name" id="name">${country.name.common}</h3>
                </div>
                <div class="details" id="details">
                    <p class="capital" id="capital">Capital : ${country.capital}</p>
                    <p class="language" id="language">Languages : ${languages}</p>
                    <p class="population" id="population">Population : ${country.population}</p>
                </div>
            </div>
    `;
    })
    .join("");
};

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  console.log(searchTerm);
  const filterdCountries = countriesArray.filter((country) =>
    country.name.common.trim().toLowerCase().startsWith(searchTerm)
  );
  displayCountries(filterdCountries);
  handlePopulationWithConditionalRest(filterdCountries, false);
});

btnNameFilter.addEventListener("click", () => {
  if (isSorted) {
    const sortedCountries = countriesArray.sort((a, b) =>
      b.name.common.localeCompare(a.name.common)
    );
    isSorted = !isSorted;
    btnNameFilter.innerText = "Name ↑";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  } else {
    const sortedCountries = countriesArray.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );
    isSorted = !isSorted;
    btnNameFilter.innerText = "Name ↓";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  }
});

btnCapitalFilter.addEventListener("click", () => {
  if (isSorted) {
    const sortedCountries = countriesArray.sort((a, b) => {
      if (!a.capital && !b.capital) return 0;
      if (!a.capital) return -1;
      if (!b.capital) return 1;
      return b.capital[0].localeCompare(a.capital[0]);
    });
    isSorted = !isSorted;
    btnCapitalFilter.innerText = "Capital ↑";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  } else {
    const sortedCountries = countriesArray.sort((a, b) => {
      if (!a.capital && !b.capital) return 0;
      if (!a.capital) return 1;
      if (!b.capital) return -1;
      return a.capital[0].localeCompare(b.capital[0]);
    });
    isSorted = !isSorted;
    btnCapitalFilter.innerText = "Capital ↓";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  }
});

btnPopFilter.addEventListener("click", () => {
  if (isSorted) {
    const sortedCountries = countriesArray.sort(
      (a, b) => b.population - a.population
    );
    isSorted = !isSorted;
    btnPopFilter.innerText = "Population ↑";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  } else {
    const sortedCountries = countriesArray.sort(
      (a, b) => a.population - b.population
    );
    isSorted = !isSorted;
    btnPopFilter.innerText = "Population ↓";
    countriesSection.innerHTML = "";
    displayCountries(sortedCountries);
  }
});

btnPopulation.addEventListener("click", () =>
  handlePopulationWithConditionalRest(countriesArray)
);

function withConditionalRest(handlePopulationFn) {
  return function (country, shouldReset = true) {
    if (shouldReset) {
      countriesSection.innerHTML = "";
    }
    handlePopulationFn(country);
  };
}

const handlePopulationWithConditionalRest =
  withConditionalRest(handlePopulation);

function handlePopulation(country) {
  const sortedByPopulation = country.sort(
    (a, b) => b.population - a.population
  );
  const maxPopulation = sortedByPopulation[0].population;
  popSection.innerHTML = sortedByPopulation
    .map((country) => {
      const barWidth = (country.population / maxPopulation) * 100;
      return `
      <div class="population-data" id="population-data">
        <p class="country-name" id="country-name">${country.name.common}</p>
        <div class="population-bar-container" id="population-bar-container">
          <div class="population-bar" id="population-bar" style="width : ${barWidth}%"></div>
        </div>
        <p class="population-value" id="population-value">${country.population}</p>
      </div>
    `;
    })
    .join("");
}
