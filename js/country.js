/* ==========================
   COUNTRY DETAIL
========================== */

const countryDetail = document.querySelector("#country-detail");
const countryDetailStatus = document.querySelector(
    "#country-detail-status"
);

const countryGuideSection = document.querySelector(
    "#country-guide-section"
);

const countryGuideTitle = document.querySelector(
    "#country-guide-title"
);

const countryGuideStatus = document.querySelector(
    "#country-guide-status"
);

const countryGuideContent = document.querySelector(
    "#country-guide-content"
);

const countryGuideTabs = document.querySelectorAll(
    ".country-guide-tab"
);

let selectedCountry = null;
let activeGuideCategory = "foods";

const countryGuideCache = {
    foods: null,
    places: null,
    activities: null
};

/* ==========================
   GET COUNTRY CODE
========================== */

function getCountryCode() {
    const parameters = new URLSearchParams(
        window.location.search
    );

    return parameters.get("code")?.toUpperCase() || "";
}

/* ==========================
   GET COUNTRY DETAIL
========================== */

async function getCountryDetail() {
    try {
        showCountryLoading();

        const countryCode = getCountryCode();

if (!countryCode) {
    showCountryNotFound(
        "Bağlantıda bir ülke kodu bulunamadı."
    );
    return;
}

        const [countriesData, populationData] =
            await Promise.all([
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
    showCountryNotFound(
        "Aradığın ülkeye ait bilgiler bulunamadı. Bağlantı hatalı veya ülke kodu geçersiz olabilir."
    );
    return;
}

        let englishName =
            country.name?.common || "Bilinmiyor";

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

            englishName,

            capital: country.capital || [],

            region:
                country.region || "Bilinmiyor",

            subregion:
                country.subregion || "Bilinmiyor",

            population:
                Number(populationItem?.population) || 0,

            flags: {
                svg: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
            },

            cca2: country.cca2,
            cca3: country.cca3,

            currencies: country.currencies || {},
            languages: country.languages || {},
            timezones: country.timezones || [],
            latlng: country.latlng || []
        };

renderCountryDetail(selectedCountry);

initializeCountryTravelInfo();
await initializeCountrySummary();
await initializeCountryCurrency();
await initializeCountryWeather();
await initializeCountryGuide();

    } catch (error) {
        console.error(
            "Ülke detayı alınamadı:",
            error
        );

        showCountryError(
            "Ülke bilgileri yüklenemedi. Lütfen daha sonra tekrar dene."
        );
    }
}

/* ==========================
   FORMAT CURRENCIES
========================== */

function formatCurrencies(currencies) {
    const currencyList = Object.entries(
        currencies
    ).map(([code, currency]) => {
        const currencyName =
            currency.name || code;

        const symbol = currency.symbol
            ? ` (${currency.symbol})`
            : "";

        return `${currencyName}${symbol}`;
    });

    return currencyList.length > 0
        ? currencyList.join(", ")
        : "Bilinmiyor";
}

/* ==========================
   FORMAT LANGUAGES
========================== */

function formatLanguages(languages) {
    const languageList =
        Object.values(languages);

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

    const capital =
        country.capital?.[0] || "Bilinmiyor";

    const population =
        country.population > 0
            ? country.population.toLocaleString(
                "tr-TR"
            )
            : "Bilinmiyor";

    const currencies = formatCurrencies(
        country.currencies
    );

    const languages = formatLanguages(
        country.languages
    );

    const timezones =
        country.timezones.length > 0
            ? country.timezones.join(", ")
            : "Bilinmiyor";

    const mapLink = createMapLink(
        country.latlng
    );

    const favoriteActive = isFavorite(
        country.cca3
    );

    document.title =
        `${country.name.common} | TravelHub`;

    countryDetail.innerHTML = `
        <div class="country-detail-image">
            <img
                src="${country.flags.svg}"
                alt="${escapeCountryHtml(
                    country.name.common
                )} bayrağı"
            >
        </div>

        <div class="country-detail-content">
            <span class="section-label">
                Ülke Bilgileri
            </span>

            <h1>
                ${escapeCountryHtml(
                    country.name.common
                )}
            </h1>

            <div class="country-detail-grid">

                <div class="country-info-item">
                    <i class="fa-solid fa-city"></i>

                    <div>
                        <span>Başkent</span>
                        <strong>
                            ${escapeCountryHtml(capital)}
                        </strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-earth-americas"></i>

                    <div>
                        <span>Kıta</span>
                        <strong>
                            ${escapeCountryHtml(
                                country.region
                            )}
                        </strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-location-dot"></i>

                    <div>
                        <span>Alt Bölge</span>
                        <strong>
                            ${escapeCountryHtml(
                                country.subregion
                            )}
                        </strong>
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
                        <strong>
                            ${escapeCountryHtml(
                                currencies
                            )}
                        </strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-language"></i>

                    <div>
                        <span>Diller</span>
                        <strong>
                            ${escapeCountryHtml(
                                languages
                            )}
                        </strong>
                    </div>
                </div>

                <div class="country-info-item">
                    <i class="fa-solid fa-clock"></i>

                    <div>
                        <span>Saat Dilimi</span>
                        <strong>
                            ${escapeCountryHtml(
                                timezones
                            )}
                        </strong>
                    </div>
                </div>

            </div>

            <div class="country-detail-actions">

                <button
                    id="detail-favorite-button"
                    class="btn-primary ${
                        favoriteActive
                            ? "favorite-active"
                            : ""
                    }"
                    type="button"
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

    favoriteButton?.addEventListener(
        "click",
        () => {
            if (!selectedCountry) {
                return;
            }

            toggleFavorite(selectedCountry);
            renderCountryDetail(selectedCountry);
        }
    );
}

/* ==========================
   INITIALIZE COUNTRY TRAVEL INFO
========================== */

function initializeCountryTravelInfo() {
    if (!selectedCountry) {
        return;
    }

    renderCountryTravelInfo(
        selectedCountry
    );
}

/* ==========================
   INITIALIZE COUNTRY SUMMARY
========================== */

async function initializeCountrySummary() {
    if (!selectedCountry) {
        return;
    }

    showCountrySummaryLoading(
        selectedCountry
    );

    try {
        const summaryData =
            await getCountrySummary(
                selectedCountry
            );

        renderCountrySummary(
            selectedCountry,
            summaryData
        );

    } catch (error) {
        console.error(
            "Ülke özeti alınamadı:",
            error
        );

        showCountrySummaryError();

        const retryButton =
            document.querySelector(
                "#retry-country-summary"
            );

        retryButton?.addEventListener(
            "click",
            initializeCountrySummary
        );
    }
}

/* ==========================
   INITIALIZE COUNTRY CURRENCY
========================== */

async function initializeCountryCurrency() {
    if (!selectedCountry) {
        return;
    }

    await renderCountryCurrency(
        selectedCountry
    );
}

/* ==========================
   INITIALIZE COUNTRY WEATHER
========================== */

async function initializeCountryWeather() {
    const weatherSection = document.querySelector(
        "#country-weather-section"
    );

    const weatherStatus = document.querySelector(
        "#country-weather-status"
    );

    const weatherContent = document.querySelector(
        "#country-weather-content"
    );

    if (
        !selectedCountry ||
        !weatherSection ||
        !weatherStatus ||
        !weatherContent
    ) {
        return;
    }

    const latitude = selectedCountry.latlng?.[0];
    const longitude = selectedCountry.latlng?.[1];
    const capital =
        selectedCountry.capital?.[0] ||
        selectedCountry.name.common;

    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {
        weatherSection.hidden = true;
        return;
    }

    weatherSection.hidden = false;
    weatherContent.innerHTML = "";

    weatherStatus.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                ${escapeCountryHtml(capital)}
                hava durumu yükleniyor...
            </p>
        </div>
    `;

    try {
        const weather = await getCountryWeather(
            latitude,
            longitude
        );

        renderCountryWeather(
            selectedCountry,
            weather
        );
    } catch (error) {
        console.error(
            "Başkent hava durumu alınamadı:",
            error
        );

        weatherContent.innerHTML = "";

        weatherStatus.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-cloud-bolt"></i>

                <h3>Hava durumu alınamadı</h3>

                <p>
                    Güncel hava bilgileri şu anda
                    yüklenemiyor.
                </p>

                <button
                    id="retry-country-weather"
                    class="btn-primary"
                    type="button"
                >
                    <i class="fa-solid fa-rotate-right"></i>
                    Tekrar Dene
                </button>
            </div>
        `;

        const retryButton = document.querySelector(
            "#retry-country-weather"
        );

        retryButton?.addEventListener(
            "click",
            initializeCountryWeather
        );
    }
}

/* ==========================
   INITIALIZE COUNTRY GUIDE
========================== */

async function initializeCountryGuide() {
    if (
        !selectedCountry ||
        !countryGuideSection ||
        !countryGuideContent
    ) {
        return;
    }

    countryGuideSection.hidden = false;

    if (countryGuideTitle) {
        countryGuideTitle.textContent =
            `${selectedCountry.name.common} Seyahat Rehberi`;
    }

    addCountryGuideTabEvents();

    await loadAndRenderGuideCategory(
        activeGuideCategory
    );
}

/* ==========================
   GUIDE TAB EVENTS
========================== */

function addCountryGuideTabEvents() {
    countryGuideTabs.forEach(tab => {
        if (tab.dataset.listenerAdded === "true") {
            return;
        }

        tab.dataset.listenerAdded = "true";

        tab.addEventListener(
            "click",
            async () => {
                const category =
                    tab.dataset.guideTab;

                if (
                    !category ||
                    category === activeGuideCategory
                ) {
                    return;
                }

                activeGuideCategory = category;

                updateActiveGuideTab(category);

                await loadAndRenderGuideCategory(
                    category
                );
            }
        );
    });
}

/* ==========================
   UPDATE ACTIVE TAB
========================== */

function updateActiveGuideTab(category) {
    countryGuideTabs.forEach(tab => {
        const isActive =
            tab.dataset.guideTab === category;

        tab.classList.toggle(
            "active",
            isActive
        );

        tab.setAttribute(
            "aria-selected",
            String(isActive)
        );
    });
}

/* ==========================
   LOAD GUIDE CATEGORY
========================== */

async function loadAndRenderGuideCategory(
    category
) {
    if (
        !selectedCountry ||
        !countryGuideContent
    ) {
        return;
    }

    updateActiveGuideTab(category);

    if (countryGuideCache[category]) {
        renderCountryGuideItems(
            countryGuideCache[category],
            category
        );

        return;
    }

    showCountryGuideLoading(category);

    try {
        const items =
            await loadCountryGuideCategory(
                selectedCountry,
                category
            );

        countryGuideCache[category] = items;

        renderCountryGuideItems(
            items,
            category
        );

    } catch (error) {
        console.error(
            "Ülke rehberi yüklenemedi:",
            error
        );

        showCountryGuideError();
    }
}

/* ==========================
   RENDER GUIDE ITEMS
========================== */

function renderCountryGuideItems(
    items,
    category
) {
    if (
        !countryGuideContent ||
        !countryGuideStatus
    ) {
        return;
    }

    countryGuideStatus.innerHTML = "";

    if (!items || items.length === 0) {
        countryGuideContent.innerHTML = `
            <div class="country-guide-empty">
                <i class="fa-regular fa-folder-open"></i>

                <h3>İçerik bulunamadı</h3>

                <p>
                    Bu ülke için henüz yeterli
                    bilgi bulunamadı.
                </p>
            </div>
        `;

        return;
    }

    countryGuideContent.innerHTML =
        items.map(item =>
            createCountryGuideCard(
                item,
                category
            )
        ).join("");
}

/* ==========================
   CREATE GUIDE CARD
========================== */

function createCountryGuideCard(
    item,
    category
) {
    const categoryIcons = {
        foods: "fa-utensils",
        places: "fa-location-dot",
        activities: "fa-person-hiking"
    };

    const icon =
        categoryIcons[category] ||
        "fa-compass";

    const safeTitle = escapeCountryHtml(
        item.title
    );

    const safeDescription =
        escapeCountryHtml(
            shortenGuideDescription(
                item.description
            )
        );

    const safePageUrl =
        escapeCountryAttribute(
            item.pageUrl || "#"
        );

    const imageContent = item.image
        ? `
            <img
                src="${escapeCountryAttribute(
                    item.image
                )}"
                alt="${safeTitle}"
                loading="lazy"
                referrerpolicy="no-referrer"
            >
        `
        : `
            <div class="country-guide-image-placeholder">
                <i class="fa-solid ${icon}"></i>
            </div>
        `;

    return `
        <article class="country-guide-card">

            <div class="country-guide-card-image">
                ${imageContent}

                <span class="country-guide-card-icon">
                    <i class="fa-solid ${icon}"></i>
                </span>
            </div>

            <div class="country-guide-card-content">

                <h3>${safeTitle}</h3>

                <p>${safeDescription}</p>

                <a
                    href="${safePageUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="country-guide-card-link"
                >
                    Daha Fazla Bilgi

                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>

            </div>

        </article>
    `;
}

/* ==========================
   SHORTEN DESCRIPTION
========================== */

function shortenGuideDescription(
    description,
    maximumLength = 190
) {
    if (!description) {
        return "Bu içerik hakkında kısa açıklama bulunamadı.";
    }

    const cleanDescription = description
        .replace(/\s+/g, " ")
        .trim();

    if (
        cleanDescription.length <= maximumLength
    ) {
        return cleanDescription;
    }

    const shortened = cleanDescription.slice(
        0,
        maximumLength
    );

    const lastSpace =
        shortened.lastIndexOf(" ");

    return `${shortened.slice(
        0,
        lastSpace > 0
            ? lastSpace
            : maximumLength
    )}...`;
}

/* ==========================
   GUIDE STATES
========================== */

function showCountryGuideLoading(category) {
    if (
        !countryGuideStatus ||
        !countryGuideContent
    ) {
        return;
    }

    const categoryName =
        COUNTRY_GUIDE_CONFIG?.[category]?.label ||
        "İçerikler";

    countryGuideContent.innerHTML = "";

    countryGuideStatus.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                ${escapeCountryHtml(
                    categoryName
                )} yükleniyor...
            </p>
        </div>
    `;
}

function showCountryGuideError() {
    if (
        !countryGuideStatus ||
        !countryGuideContent
    ) {
        return;
    }

    countryGuideContent.innerHTML = "";

    countryGuideStatus.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-triangle-exclamation"></i>

            <h3>Rehber yüklenemedi</h3>

            <p>
                İçerikler şu anda alınamıyor.
                Lütfen daha sonra tekrar dene.
            </p>

            <button
                id="retry-guide-button"
                class="btn-primary"
                type="button"
            >
                <i class="fa-solid fa-rotate-right"></i>
                Tekrar Dene
            </button>
        </div>
    `;

    const retryButton = document.querySelector(
        "#retry-guide-button"
    );

    retryButton?.addEventListener(
        "click",
        () => {
            countryGuideCache[
                activeGuideCategory
            ] = null;

            loadAndRenderGuideCategory(
                activeGuideCategory
            );
        }
    );
}

/* ==========================
   COUNTRY STATES
========================== */

function showCountryLoading() {
    const status = document.querySelector(
        "#country-detail-status"
    );

    const detail = document.querySelector(
        "#country-detail"
    );

    const weatherSection = document.querySelector(
        "#country-weather-section"
    );

    const summarySection = document.querySelector(
        "#country-summary-section"
    );

    const guideSection = document.querySelector(
        "#country-guide-section"
    );

    const travelInfoSection = document.querySelector(
        "#country-travel-info-section"
    );

    const currencySection = document.querySelector(
        "#country-currency-section"
    );

    if (weatherSection) {
        weatherSection.hidden = true;
    }

    if (summarySection) {
        summarySection.hidden = true;
    }

    if (guideSection) {
        guideSection.hidden = true;
    }

    if (travelInfoSection) {
        travelInfoSection.hidden = true;
    }

    if (currencySection) {
        currencySection.hidden = true;
    }

    if (detail) {
        detail.innerHTML = "";
    }

    if (status) {
        status.innerHTML = `
            <div class="loading-state">
                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Ülke bilgileri yükleniyor...
                </p>
            </div>
        `;
    }
}

function showCountryNotFound(message) {
    const status = document.querySelector(
        "#country-detail-status"
    );

    const detail = document.querySelector(
        "#country-detail"
    );

    const pageSections = [
        "#country-weather-section",
        "#country-summary-section",
        "#country-guide-section",
        "#country-travel-info-section",
        "#country-currency-section"
    ];

    pageSections.forEach(selector => {
        const section = document.querySelector(
            selector
        );

        if (section) {
            section.hidden = true;
        }
    });

    if (detail) {
        detail.innerHTML = "";
    }

    document.title =
        "Ülke Bulunamadı | TravelHub";

    if (status) {
        status.innerHTML = `
            <section class="country-not-found">
                <div class="country-not-found-icon">
                    <i class="fa-solid fa-map-location-dot"></i>
                </div>

                <p class="country-not-found-code">
                    404
                </p>

                <h1>Ülke bulunamadı</h1>

                <p>
                    ${escapeCountryHtml(message)}
                </p>

                <a
                    href="countries.html"
                    class="btn-primary"
                >
                    <i class="fa-solid fa-arrow-left"></i>
                    Ülkelere Dön
                </a>
            </section>
        `;
    }
}

function showCountryError(message) {
    const status = document.querySelector(
        "#country-detail-status"
    );

    const detail = document.querySelector(
        "#country-detail"
    );

    const weatherSection = document.querySelector(
        "#country-weather-section"
    );

    const summarySection = document.querySelector(
        "#country-summary-section"
    );

    const guideSection = document.querySelector(
        "#country-guide-section"
    );

    const travelInfoSection = document.querySelector(
        "#country-travel-info-section"
    );

    const currencySection = document.querySelector(
        "#country-currency-section"
    );

    if (weatherSection) {
        weatherSection.hidden = true;
    }

    if (summarySection) {
        summarySection.hidden = true;
    }

    if (guideSection) {
        guideSection.hidden = true;
    }

    if (travelInfoSection) {
        travelInfoSection.hidden = true;
    }

    if (currencySection) {
        currencySection.hidden = true;
    }

    if (detail) {
        detail.innerHTML = "";
    }

    if (status) {
        status.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>Ülke bilgileri yüklenemedi</h3>

                <p>
                    ${escapeCountryHtml(message)}
                </p>

                <button
                    id="retry-country-detail"
                    class="btn-primary"
                    type="button"
                >
                    <i class="fa-solid fa-rotate-right"></i>
                    Tekrar Dene
                </button>
            </div>
        `;

        const retryButton = document.querySelector(
            "#retry-country-detail"
        );

        retryButton?.addEventListener(
            "click",
            getCountryDetail
        );
    }
}

/* ==========================
   SECURITY HELPERS
========================== */

function escapeCountryHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeCountryAttribute(value) {
    return escapeCountryHtml(value);
}

/* ==========================
   START
========================== */

getCountryDetail();