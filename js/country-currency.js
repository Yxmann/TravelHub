/* ==========================
   COUNTRY CURRENCY CONVERTER
========================== */

const CURRENCY_API_URL =
    "https://api.frankfurter.dev/v2/rate";

let selectedCurrencyCountry = null;
let currentCurrencyRate = null;
let currentCurrencyDate = null;
let currencyInputTimer = null;

/* ==========================
   GET COUNTRY CURRENCY
========================== */

function getCountryCurrency(country) {
    const currencyCodes = Object.keys(
        country.currencies || {}
    );

    if (currencyCodes.length === 0) {
        return null;
    }

    return currencyCodes[0];
}

/* ==========================
   GET CURRENCY INFORMATION
========================== */

function getCurrencyInformation(
    country,
    currencyCode
) {
    const currency =
        country.currencies?.[currencyCode];

    return {
        code: currencyCode,
        name:
            currency?.name ||
            currencyCode,
        symbol:
            currency?.symbol ||
            currencyCode
    };
}

/* ==========================
   CREATE CURRENCY OPTION
========================== */

function createCurrencyOption(
    currencyCode,
    currencyName
) {
    const option =
        document.createElement("option");

    option.value = currencyCode;
    option.textContent =
        `${currencyCode} - ${currencyName}`;

    return option;
}

/* ==========================
   PREPARE CURRENCY SELECTS
========================== */

function prepareCurrencySelects(country) {
    const fromSelect =
        document.querySelector(
            "#currency-from"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    if (!fromSelect || !toSelect) {
        return false;
    }

    const countryCurrencyCode =
        getCountryCurrency(country);

    if (!countryCurrencyCode) {
        return false;
    }

    const countryCurrency =
        getCurrencyInformation(
            country,
            countryCurrencyCode
        );

    fromSelect.innerHTML = "";
    toSelect.innerHTML = "";

    const currencyOptions = [
        {
            code: "TRY",
            name: "Türk Lirası"
        },
        {
            code: countryCurrency.code,
            name: countryCurrency.name
        }
    ];

    const uniqueCurrencies =
        currencyOptions.filter(
            (currency, index, list) =>
                list.findIndex(
                    item =>
                        item.code ===
                        currency.code
                ) === index
        );

    uniqueCurrencies.forEach(currency => {
        fromSelect.appendChild(
            createCurrencyOption(
                currency.code,
                currency.name
            )
        );

        toSelect.appendChild(
            createCurrencyOption(
                currency.code,
                currency.name
            )
        );
    });

    fromSelect.value = "TRY";
    toSelect.value =
        countryCurrencyCode;

    if (
        countryCurrencyCode === "TRY"
    ) {
        fromSelect.value = "TRY";
        toSelect.value = "TRY";
    }

    return true;
}

/* ==========================
   FETCH CURRENCY RATE
========================== */

async function getCurrencyRate(
    fromCurrency,
    toCurrency
) {
    if (
        !fromCurrency ||
        !toCurrency
    ) {
        throw new Error(
            "Para birimi seçimi eksik."
        );
    }

    if (
        fromCurrency === toCurrency
    ) {
        return {
            rate: 1,
            date:
                new Date()
                    .toISOString()
                    .split("T")[0]
        };
    }

    const requestUrl =
        `${CURRENCY_API_URL}/` +
        `${encodeURIComponent(fromCurrency)}/` +
        `${encodeURIComponent(toCurrency)}`;

    const response =
        await fetch(requestUrl);

    if (!response.ok) {
        throw new Error(
            "Döviz kuru alınamadı."
        );
    }

    const data =
        await response.json();

    const rate =
        Number(data.rate);

    if (!Number.isFinite(rate)) {
        throw new Error(
            "Geçerli kur verisi bulunamadı."
        );
    }

    return {
        rate,
        date:
            data.date ||
            new Date()
                .toISOString()
                .split("T")[0]
    };
}

/* ==========================
   FORMAT CURRENCY NUMBER
========================== */

function formatCurrencyNumber(
    value,
    currencyCode
) {
    if (!Number.isFinite(value)) {
        return "--";
    }

    try {
        return new Intl.NumberFormat(
            "tr-TR",
            {
                style: "currency",
                currency: currencyCode,
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            }
        ).format(value);

    } catch (error) {
        return `${value.toLocaleString(
            "tr-TR",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            }
        )} ${currencyCode}`;
    }
}

/* ==========================
   FORMAT RATE NUMBER
========================== */

function formatCurrencyRate(value) {
    if (!Number.isFinite(value)) {
        return "--";
    }

    return value.toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }
    );
}

/* ==========================
   FORMAT UPDATE DATE
========================== */

function formatCurrencyDate(dateText) {
    if (!dateText) {
        return "Güncelleme tarihi bilinmiyor";
    }

    const date =
        new Date(`${dateText}T12:00:00`);

    if (
        Number.isNaN(date.getTime())
    ) {
        return dateText;
    }

    return date.toLocaleDateString(
        "tr-TR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}

/* ==========================
   CALCULATE CURRENCY RESULT
========================== */

function calculateCurrencyResult() {
    const amountInput =
        document.querySelector(
            "#currency-amount"
        );

    const resultInput =
        document.querySelector(
            "#currency-result"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    if (
        !amountInput ||
        !resultInput ||
        !toSelect
    ) {
        return;
    }

    const amount =
        Number(amountInput.value);

    if (
        !Number.isFinite(amount) ||
        amount < 0
    ) {
        resultInput.value = "--";
        return;
    }

    if (
        !Number.isFinite(
            currentCurrencyRate
        )
    ) {
        resultInput.value = "--";
        return;
    }

    const result =
        amount * currentCurrencyRate;

    resultInput.value =
        formatCurrencyNumber(
            result,
            toSelect.value
        );
}

/* ==========================
   UPDATE RATE INFORMATION
========================== */

function updateCurrencyRateInformation() {
    const fromSelect =
        document.querySelector(
            "#currency-from"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    const rateText =
        document.querySelector(
            "#currency-rate-text"
        );

    const updateDate =
        document.querySelector(
            "#currency-update-date"
        );

    if (
        !fromSelect ||
        !toSelect ||
        !rateText ||
        !updateDate
    ) {
        return;
    }

    rateText.textContent =
        `1 ${fromSelect.value} = ` +
        `${formatCurrencyRate(
            currentCurrencyRate
        )} ${toSelect.value}`;

    updateDate.textContent =
        `Son güncelleme: ` +
        `${formatCurrencyDate(
            currentCurrencyDate
        )}`;
}

/* ==========================
   CURRENCY LOADING
========================== */

function showCurrencyLoading() {
    const section =
        document.querySelector(
            "#country-currency-section"
        );

    const status =
        document.querySelector(
            "#country-currency-status"
        );

    const content =
        document.querySelector(
            "#country-currency-content"
        );

    const refreshButton =
        document.querySelector(
            "#currency-refresh-button"
        );

    if (section) {
        section.hidden = false;
    }

    if (content) {
        content.hidden = true;
    }

    if (refreshButton) {
        refreshButton.disabled = true;
    }

    if (status) {
        status.innerHTML = `
            <div class="loading-state">
                <i class="fa-solid fa-spinner fa-spin"></i>

                <p>
                    Güncel döviz kuru yükleniyor...
                </p>
            </div>
        `;
    }
}

/* ==========================
   CURRENCY SUCCESS
========================== */

function showCurrencySuccess() {
    const status =
        document.querySelector(
            "#country-currency-status"
        );

    const content =
        document.querySelector(
            "#country-currency-content"
        );

    const refreshButton =
        document.querySelector(
            "#currency-refresh-button"
        );

    if (status) {
        status.innerHTML = "";
    }

    if (content) {
        content.hidden = false;
    }

    if (refreshButton) {
        refreshButton.disabled = false;
    }
}

/* ==========================
   CURRENCY ERROR
========================== */

function showCurrencyError(message) {
    const section =
        document.querySelector(
            "#country-currency-section"
        );

    const status =
        document.querySelector(
            "#country-currency-status"
        );

    const content =
        document.querySelector(
            "#country-currency-content"
        );

    if (section) {
        section.hidden = false;
    }

    if (content) {
        content.hidden = true;
    }

    if (!status) {
        return;
    }

    status.innerHTML = `
        <div class="error-state">
            <i class="fa-solid fa-coins"></i>

            <h3>Döviz kuru alınamadı</h3>

            <p>
                ${escapeCountryHtml(message)}
            </p>

            <button
                id="retry-country-currency"
                class="btn-primary"
                type="button"
            >
                <i class="fa-solid fa-rotate-right"></i>
                Tekrar Dene
            </button>
        </div>
    `;

    const retryButton =
        document.querySelector(
            "#retry-country-currency"
        );

    retryButton?.addEventListener(
        "click",
        loadCountryCurrencyRate
    );
}

/* ==========================
   LOAD CURRENCY RATE
========================== */

async function loadCountryCurrencyRate() {
    const fromSelect =
        document.querySelector(
            "#currency-from"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    if (
        !fromSelect ||
        !toSelect
    ) {
        return;
    }

    showCurrencyLoading();

    try {
        const result =
            await getCurrencyRate(
                fromSelect.value,
                toSelect.value
            );

        currentCurrencyRate =
            result.rate;

        currentCurrencyDate =
            result.date;

        updateCurrencyRateInformation();
        calculateCurrencyResult();
        showCurrencySuccess();

    } catch (error) {
        console.error(
            "Döviz kuru alınamadı:",
            error
        );

        currentCurrencyRate = null;
        currentCurrencyDate = null;

        showCurrencyError(
            "Güncel kur bilgisi şu anda yüklenemiyor. Lütfen tekrar dene."
        );
    }
}

/* ==========================
   SWAP CURRENCIES
========================== */

async function swapCurrencies() {
    const fromSelect =
        document.querySelector(
            "#currency-from"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    if (
        !fromSelect ||
        !toSelect
    ) {
        return;
    }

    const previousFrom =
        fromSelect.value;

    fromSelect.value =
        toSelect.value;

    toSelect.value =
        previousFrom;

    await loadCountryCurrencyRate();
}

/* ==========================
   ADD CURRENCY EVENTS
========================== */

function addCurrencyEvents() {
    const amountInput =
        document.querySelector(
            "#currency-amount"
        );

    const fromSelect =
        document.querySelector(
            "#currency-from"
        );

    const toSelect =
        document.querySelector(
            "#currency-to"
        );

    const swapButton =
        document.querySelector(
            "#currency-swap-button"
        );

    const refreshButton =
        document.querySelector(
            "#currency-refresh-button"
        );

    if (
        amountInput &&
        amountInput.dataset.listenerAdded !==
            "true"
    ) {
        amountInput.dataset.listenerAdded =
            "true";

        amountInput.addEventListener(
            "input",
            () => {
                clearTimeout(
                    currencyInputTimer
                );

                currencyInputTimer =
                    setTimeout(
                        calculateCurrencyResult,
                        120
                    );
            }
        );
    }

    if (
        fromSelect &&
        fromSelect.dataset.listenerAdded !==
            "true"
    ) {
        fromSelect.dataset.listenerAdded =
            "true";

        fromSelect.addEventListener(
            "change",
            loadCountryCurrencyRate
        );
    }

    if (
        toSelect &&
        toSelect.dataset.listenerAdded !==
            "true"
    ) {
        toSelect.dataset.listenerAdded =
            "true";

        toSelect.addEventListener(
            "change",
            loadCountryCurrencyRate
        );
    }

    if (
        swapButton &&
        swapButton.dataset.listenerAdded !==
            "true"
    ) {
        swapButton.dataset.listenerAdded =
            "true";

        swapButton.addEventListener(
            "click",
            swapCurrencies
        );
    }

    if (
        refreshButton &&
        refreshButton.dataset.listenerAdded !==
            "true"
    ) {
        refreshButton.dataset.listenerAdded =
            "true";

        refreshButton.addEventListener(
            "click",
            loadCountryCurrencyRate
        );
    }
}

/* ==========================
   RENDER COUNTRY CURRENCY
========================== */

async function renderCountryCurrency(country) {
    const section =
        document.querySelector(
            "#country-currency-section"
        );

    const title =
        document.querySelector(
            "#country-currency-title"
        );

    if (
        !country ||
        !section ||
        !title
    ) {
        return;
    }

    const countryCurrencyCode =
        getCountryCurrency(country);

    if (!countryCurrencyCode) {
        section.hidden = true;
        return;
    }

    selectedCurrencyCountry = country;

    section.hidden = false;

    title.textContent =
        `${country.name.common} Döviz Çevirici`;

    const selectsPrepared =
        prepareCurrencySelects(country);

    if (!selectsPrepared) {
        section.hidden = true;
        return;
    }

    addCurrencyEvents();

    await loadCountryCurrencyRate();
}