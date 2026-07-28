/* ==========================
   COUNTRY SUMMARY
========================== */

const COUNTRY_SUMMARY_NAMES = {
    TUR: "Türkiye",
    USA: "United States",
    GBR: "United Kingdom",
    KOR: "South Korea",
    PRK: "North Korea",
    CZE: "Czech Republic",
    RUS: "Russia",
    IRN: "Iran",
    SYR: "Syria",
    LAO: "Laos",
    VNM: "Vietnam",
    BOL: "Bolivia",
    VEN: "Venezuela",
    TZA: "Tanzania",
    CIV: "Ivory Coast",
    COD: "Democratic Republic of the Congo",
    COG: "Republic of the Congo"
};

/* ==========================
   GET SUMMARY SEARCH NAME
========================== */

function getCountrySummarySearchName(country) {
    if (!country) {
        return "";
    }

    return (
        COUNTRY_SUMMARY_NAMES[country.cca3] ||
        country.englishName ||
        country.name?.common ||
        ""
    );
}

/* ==========================
   CLEAN SUMMARY TEXT
========================== */

function cleanCountrySummaryText(text) {
    if (!text) {
        return "";
    }

    return text
        .replace(/\s+/g, " ")
        .replace(/\[[^\]]*\]/g, "")
        .trim();
}

/* ==========================
   SHORTEN SUMMARY
========================== */

function shortenCountrySummary(
    text,
    maximumLength = 520
) {
    const cleanText =
        cleanCountrySummaryText(text);

    if (!cleanText) {
        return "";
    }

    if (cleanText.length <= maximumLength) {
        return cleanText;
    }

    const shortenedText = cleanText.slice(
        0,
        maximumLength
    );

    const lastPeriod =
        shortenedText.lastIndexOf(".");

    if (lastPeriod > 200) {
        return `${shortenedText.slice(
            0,
            lastPeriod + 1
        )}`;
    }

    const lastSpace =
        shortenedText.lastIndexOf(" ");

    return `${shortenedText.slice(
        0,
        lastSpace > 0
            ? lastSpace
            : maximumLength
    )}...`;
}

/* ==========================
   GET COUNTRY SUMMARY
========================== */

async function getCountrySummary(country) {
    const searchName =
        getCountrySummarySearchName(country);

    if (!searchName) {
        throw new Error(
            "Ülke adı bulunamadı."
        );
    }

    const searchParameters = new URLSearchParams({
        action: "query",
        format: "json",
        origin: "*",
        generator: "search",
        gsrsearch: searchName,
        gsrlimit: "5",
        gsrnamespace: "0",
        prop: "extracts|info",
        exintro: "1",
        explaintext: "1",
        inprop: "url",
        redirects: "1"
    });

    const response = await fetch(
        `https://en.wikipedia.org/w/api.php?${searchParameters}`
    );

    if (!response.ok) {
        throw new Error(
            "Wikipedia özeti alınamadı."
        );
    }

    const data = await response.json();

    const pages = Object.values(
        data.query?.pages || {}
    );

    if (pages.length === 0) {
        throw new Error(
            "Ülke özeti bulunamadı."
        );
    }

    const normalizedSearchName =
        searchName.toLocaleLowerCase("en-US");

    const exactPage = pages.find(page =>
        page.title
            ?.toLocaleLowerCase("en-US") ===
        normalizedSearchName
    );

    const selectedPage =
        exactPage ||
        pages.find(page =>
            page.extract &&
            page.fullurl
        );

    if (
        !selectedPage ||
        !selectedPage.extract
    ) {
        throw new Error(
            "Ülke özeti bulunamadı."
        );
    }

    return {
        title:
            selectedPage.title ||
            searchName,

        summary:
            shortenCountrySummary(
                selectedPage.extract
            ),

        pageUrl:
            selectedPage.fullurl ||
            `https://en.wikipedia.org/wiki/${encodeURIComponent(
                selectedPage.title || searchName
            )}`
    };
}

/* ==========================
   RENDER COUNTRY SUMMARY
========================== */

function renderCountrySummary(
    country,
    summaryData
) {
    const section = document.querySelector(
        "#country-summary-section"
    );

    const title = document.querySelector(
        "#country-summary-title"
    );

    const status = document.querySelector(
        "#country-summary-status"
    );

    const text = document.querySelector(
        "#country-summary-text"
    );

    const link = document.querySelector(
        "#country-summary-link"
    );

    if (
        !section ||
        !title ||
        !status ||
        !text ||
        !link
    ) {
        return;
    }

    section.hidden = false;

    title.textContent =
        `${country.name.common} Hakkında`;

    status.innerHTML = "";

    text.textContent =
        summaryData.summary;

    link.href =
        summaryData.pageUrl;

    link.hidden = false;
}

/* ==========================
   SUMMARY LOADING
========================== */

function showCountrySummaryLoading(country) {
    const section = document.querySelector(
        "#country-summary-section"
    );

    const status = document.querySelector(
        "#country-summary-status"
    );

    const text = document.querySelector(
        "#country-summary-text"
    );

    const link = document.querySelector(
        "#country-summary-link"
    );

    if (
        !section ||
        !status ||
        !text ||
        !link
    ) {
        return;
    }

    section.hidden = false;
    text.textContent = "";
    link.hidden = true;

    status.innerHTML = `
        <div class="loading-state">
            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                ${escapeCountryHtml(
                    country.name.common
                )} özeti yükleniyor...
            </p>
        </div>
    `;
}

/* ==========================
   SUMMARY ERROR
========================== */

function showCountrySummaryError() {
    const section = document.querySelector(
        "#country-summary-section"
    );

    const status = document.querySelector(
        "#country-summary-status"
    );

    const text = document.querySelector(
        "#country-summary-text"
    );

    const link = document.querySelector(
        "#country-summary-link"
    );

    if (
        !section ||
        !status ||
        !text ||
        !link
    ) {
        return;
    }

    section.hidden = false;
    text.textContent = "";
    link.hidden = true;

    status.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-book-open"></i>

            <h3>Ülke özeti yüklenemedi</h3>

            <p>
                Wikipedia bilgileri şu anda
                alınamıyor.
            </p>

            <button
                id="retry-country-summary"
                class="btn-primary"
                type="button"
            >
                <i class="fa-solid fa-rotate-right"></i>
                Tekrar Dene
            </button>
        </div>
    `;
}