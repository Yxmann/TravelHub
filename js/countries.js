/* ==========================
   COUNTRIES
========================== */

const countriesContainer = document.querySelector("#countries-container");
const countriesStatus = document.querySelector("#countries-status");
const countrySearch = document.querySelector("#country-search");
const regionFilter = document.querySelector("#region-filter");

let allCountries = [];

/* ==========================
   GET COUNTRIES
========================== */

async function getCountries() {
    try {

        showCountriesSkeleton();

        const [countriesData, populationData] = await Promise.all([
            fetchData(
                "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
            ),

            fetchData(
                "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json"
            )
        ]);

        const populationMap = new Map(
            populationData.map(item => [
                normalizeText(item.country),
                Number(item.population) || 0
            ])
        );

        allCountries = countriesData
            .map(country => {
                let englishName = country.name?.common || "Bilinmiyor";

if (country.cca3 === "TUR") {
    englishName = "Turkey";
}

                const turkishName =
                    country.translations?.tur?.common ||
                    englishName;

                const population =
                    populationMap.get(normalizeText(englishName)) || 0;

                return {
                    name: {
                        common: turkishName
                    },

                    capital: country.capital || [],

                    region: country.region || "Bilinmiyor",

                    population: population,

                    flags: {
                        svg: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
                    },

                    cca3: country.cca3
                };
            })
            .sort((a, b) =>
                a.name.common.localeCompare(b.name.common, "tr")
            );

setTimeout(() => {
    renderCountries(allCountries);
}, 500);

    } catch (error) {
        console.error("Ülkeler alınamadı:", error);
        showError();
    }
}
/* ==========================
   RENDER COUNTRIES
========================== */

function renderCountries(countries) {
    countriesContainer.innerHTML = "";

    if (countries.length === 0) {
        showEmpty();
        return;
    }

    countriesStatus.innerHTML = "";

    countries.forEach(country => {
    const favoriteActive = isFavorite(country.cca3);

    const capital = country.capital?.[0] || "Bilinmiyor";

        const card = document.createElement("article");

        card.className = "api-country-card";

        card.innerHTML = `
            <div class="api-country-image">
                <img
                    src="${country.flags.svg}"
                    alt="${country.name.common} bayrağı"
                    loading="lazy"
                >
            </div>

            <div class="api-country-content">
                <h3>${country.name.common}</h3>

                <p>
                    <strong>Başkent:</strong>
                    ${capital}
                </p>

                <p>
                    <strong>Kıta:</strong>
                    ${country.region}
                </p>

                <p>
                    <strong>Nüfus:</strong>
                    ${country.population.toLocaleString("tr-TR")}
                </p>

                <div class="api-country-actions">
                    <button
                        class="details-btn"
                        data-code="${country.cca3}"
                    >
                        Detayları Gör
                    </button>

                    <button
    class="favorite-btn ${favoriteActive ? "active" : ""}"
    data-code="${country.cca3}"
    aria-label="${country.name.common} ülkesini favorilere ekle"
>
    <i class="${favoriteActive ? "fa-solid" : "fa-regular"} fa-heart"></i>
</button>
                </div>
            </div>
        `;

        countriesContainer.appendChild(card);
    });
}

/* ==========================
   FILTER COUNTRIES
========================== */

function filterCountries() {
    const searchValue = normalizeText(countrySearch.value);
    const selectedRegion = regionFilter.value;

    const filteredCountries = allCountries.filter(country => {
        const countryName = normalizeText(country.name.common);

        const matchesSearch = countryName.includes(searchValue);

        const matchesRegion =
            selectedRegion === "all" ||
            country.region === selectedRegion;

        return matchesSearch && matchesRegion;
    });

    renderCountries(filteredCountries);
}

/* ==========================
   STATES
========================== */

function showCountriesSkeleton(count = 8) {
    if (!countriesStatus || !countriesContainer) {
        return;
    }

    countriesStatus.innerHTML = "";

    countriesContainer.innerHTML = `
        <div class="skeleton-grid">
            ${Array.from({ length: count }, () => `
                <article class="skeleton-card" aria-hidden="true">
                    <div class="skeleton-image"></div>

                    <div class="skeleton-content">
                        <div class="skeleton-line skeleton-line-title"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                        <div class="skeleton-line skeleton-line-small"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                        <div class="skeleton-button"></div>
                    </div>
                </article>
            `).join("")}
        </div>
    `;
}

function showEmpty() {
    countriesStatus.innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-earth-europe"></i>
            <h3>Ülke bulunamadı</h3>
            <p>Arama veya filtre seçimini değiştirmeyi dene.</p>
        </div>
    `;
}

function showError() {
    countriesContainer.innerHTML = "";

    countriesStatus.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Bir hata oluştu</h3>
            <p>Ülkeler yüklenemedi. Lütfen daha sonra tekrar dene.</p>

            <button id="retry-countries" class="btn-primary">
                Tekrar Dene
            </button>
        </div>
    `;

    document
        .querySelector("#retry-countries")
        ?.addEventListener("click", getCountries);
}
countriesContainer?.addEventListener("click", event => {

    /* FAVORITE */

    const favoriteButton = event.target.closest(".favorite-btn");

    if (favoriteButton) {

        const countryCode = favoriteButton.dataset.code;

        const selectedCountry = allCountries.find(
            country => country.cca3 === countryCode
        );

        if (!selectedCountry) return;

        const active = toggleFavorite(selectedCountry);

        updateFavoriteButton(favoriteButton, active);

        return;
    }

    /* DETAILS */

    const detailsButton = event.target.closest(".details-btn");

    if (detailsButton) {

        const countryCode = detailsButton.dataset.code;

        window.location.href =
            `country.html?code=${countryCode}`;

    }

});
/* ==========================
   EVENTS
========================== */

countrySearch?.addEventListener("input", filterCountries);
regionFilter?.addEventListener("change", filterCountries);

/* ==========================
   START
========================== */

getCountries();