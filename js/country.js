/* ==========================
   COUNTRY DETAIL
========================== */

const countryDetail = document.querySelector("#country-detail");
const countryDetailStatus = document.querySelector("#country-detail-status");

let selectedCountry = null;

/* ==========================
   GET COUNTRY CODE
========================== */

function getCountryCode() {
    const parameters = new URLSearchParams(window.location.search);

    return parameters.get("code");
}

/* ==========================
   GET COUNTRY DETAIL
========================== */

async function getCountryDetail() {
    try {
        showCountryLoading();

        const countryCode = getCountryCode();

        if (!countryCode) {
            showCountryError("Ülke kodu bulunamadı.");
            return;
        }

        const [countriesData, populationData] = await Promise.all([
            fetchData(
                "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
            ),

            fetchData(
                "https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json"
            )
        ]);

        const country = countriesData.find(
            item => item.cca3 === countryCode
        );

        if (!country) {
            showCountryError("Ülke bulunamadı.");
            return;
        }

        let englishName = country.name?.common || "Bilinmiyor";

        if (country.cca3 === "TUR") {
            englishName = "Turkey";
        }

        const populationItem = populationData.find(
            item =>
                normalizeText(item.country) ===
                normalizeText(englishName)
        );

        const turkishName =
            country.translations?.tur?.common ||
            englishName;

        selectedCountry = {
            name: {
                common: turkishName
            },

            capital: country.capital || [],

            region: country.region || "Bilinmiyor",

            subregion: country.subregion || "Bilinmiyor",

            population: Number(populationItem?.population) || 0,

            flags: {
                svg: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
            },

            cca3: country.cca3,

            currencies: country.currencies || {},

            languages: country.languages || {},

            timezones: country.timezones || [],

            latlng: country.latlng || []
        };

        renderCountryDetail(selectedCountry);

    } catch (error) {
        console.error("Ülke detayı alınamadı:", error);

        showCountryError(
            "Ülke bilgileri yüklenemedi. Lütfen daha sonra tekrar dene."
        );
    }
}

/* ==========================
   FORMAT CURRENCIES
========================== */

function formatCurrencies(currencies) {
    const currencyList = Object.entries(currencies).map(
        ([code, currency]) => {
            const currencyName = currency.name || code;
            const symbol = currency.symbol
                ? ` (${currency.symbol})`
                : "";

            return `${currencyName}${symbol}`;
        }
    );

    return currencyList.length > 0
        ? currencyList.join(", ")
        : "Bilinmiyor";
}

/* ==========================
   FORMAT LANGUAGES
========================== */

function formatLanguages(languages) {
    const languageList = Object.values(languages);

    return languageList.length > 0
        ? languageList.join(", ")
        : "Bilinmiyor";
}

/* ==========================
   CREATE MAP LINK
========================== */

function createMapLink(latlng) {
    if (!latlng || latlng.length < 2) {
        return "#";
    }

    const [latitude, longitude] = latlng;

    return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

/* ==========================
   RENDER COUNTRY DETAIL
========================== */

function renderCountryDetail(country) {
    if (!countryDetail || !countryDetailStatus) {
        return;
    }

    countryDetailStatus.innerHTML = "";

    const capital = country.capital?.[0] || "Bilinmiyor";

    const population =
        country.population > 0
            ? country.population.toLocaleString("tr-TR")
            : "Bilinmiyor";

    const currencies = formatCurrencies(country.currencies);
    const languages = formatLanguages(country.languages);

    const timezones =
        country.timezones.length > 0
            ? country.timezones.join(", ")
            : "Bilinmiyor";

    const mapLink = createMapLink(country.latlng);
    const favoriteActive = isFavorite(country.cca3);

    document.title = `${country.name.common} | TravelHub`;

    countryDetail.innerHTML = `
        <div class="country-detail-image">
            <img
                src="${country.flags.svg}"
                alt="${country.name.common} bayrağı"
            >
        </div>

        <div class="country-detail-content">
            <span class="section-label">
                Ülke Bilgileri
            </span>

            <h1>${country.name.common}</h1>

            <div class="country-detail-grid">
                <div class="country-info-item">
                    <i class="fa-solid fa-city"></i>

                    <div>
                        <span>Başkent</span>
                        <strong>${capital}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-earth-americas"></i>

                    <div>
                        <span>Kıta</span>
                        <strong>${country.region}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-location-dot"></i>

                    <div>
                        <span>Alt Bölge</span>
                        <strong>${country.subregion}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-users"></i>

                    <div>
                        <span>Nüfus</span>
                        <strong>${population}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-coins"></i>

                    <div>
                        <span>Para Birimi</span>
                        <strong>${currencies}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-language"></i>

                    <div>
                        <span>Diller</span>
                        <strong>${languages}</strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-clock"></i>

                    <div>
                        <span>Saat Dilimi</span>
                        <strong>${timezones}</strong>
                    </div>
                </div>
            </div>

            <div class="country-detail-actions">
                <button
                    id="detail-favorite-button"
                    class="btn-primary ${
                        favoriteActive ? "favorite-active" : ""
                    }"
                >
                    <i class="${
                        favoriteActive
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-heart"></i>

                    <span>
                        ${
                            favoriteActive
                                ? "Favorilerden Kaldır"
                                : "Favorilere Ekle"
                        }
                    </span>
                </button>

                <a
                    href="${mapLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary"
                >
                    <i class="fa-solid fa-map-location-dot"></i>
                    Haritada Gör
                </a>
            </div>
        </div>
    `;

    addCountryDetailEvents();
}

/* ==========================
   DETAIL EVENTS
========================== */

function addCountryDetailEvents() {
    const favoriteButton = document.querySelector(
        "#detail-favorite-button"
    );

    favoriteButton?.addEventListener("click", () => {
        if (!selectedCountry) {
            return;
        }

        toggleFavorite(selectedCountry);
        renderCountryDetail(selectedCountry);
    });
}

/* ==========================
   COUNTRY STATES
========================== */

function showCountryLoading() {
    if (!countryDetail || !countryDetailStatus) {
        return;
    }

    countryDetail.innerHTML = "";

    countryDetailStatus.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <p>Ülke bilgileri yükleniyor...</p>
        </div>
    `;
}

function showCountryError(message) {
    if (!countryDetail || !countryDetailStatus) {
        return;
    }

    countryDetail.innerHTML = "";

    countryDetailStatus.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h3>Bir hata oluştu</h3>
            <p>${message}</p>

            <a href="countries.html" class="btn-primary">
                Ülkelere Dön
            </a>
        </div>
    `;
}

/* ==========================
   START
========================== */

getCountryDetail();