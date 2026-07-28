/* ==========================
   COUNTRY WEATHER
========================== */

const WEATHER_CODES = {
    0: {
        description: "Açık",
        dayIcon: "fa-sun",
        nightIcon: "fa-moon"
    },

    1: {
        description: "Çoğunlukla Açık",
        dayIcon: "fa-cloud-sun",
        nightIcon: "fa-cloud-moon"
    },

    2: {
        description: "Parçalı Bulutlu",
        dayIcon: "fa-cloud-sun",
        nightIcon: "fa-cloud-moon"
    },

    3: {
        description: "Bulutlu",
        dayIcon: "fa-cloud",
        nightIcon: "fa-cloud"
    },

    45: {
        description: "Sisli",
        dayIcon: "fa-smog",
        nightIcon: "fa-smog"
    },

    48: {
        description: "Yoğun Sis",
        dayIcon: "fa-smog",
        nightIcon: "fa-smog"
    },

    51: {
        description: "Hafif Çiseleme",
        dayIcon: "fa-cloud-rain",
        nightIcon: "fa-cloud-rain"
    },

    53: {
        description: "Çiseleme",
        dayIcon: "fa-cloud-rain",
        nightIcon: "fa-cloud-rain"
    },

    55: {
        description: "Yoğun Çiseleme",
        dayIcon: "fa-cloud-showers-heavy",
        nightIcon: "fa-cloud-showers-heavy"
    },

    61: {
        description: "Hafif Yağmur",
        dayIcon: "fa-cloud-rain",
        nightIcon: "fa-cloud-rain"
    },

    63: {
        description: "Yağmur",
        dayIcon: "fa-cloud-showers-heavy",
        nightIcon: "fa-cloud-showers-heavy"
    },

    65: {
        description: "Şiddetli Yağmur",
        dayIcon: "fa-cloud-showers-heavy",
        nightIcon: "fa-cloud-showers-heavy"
    },

    71: {
        description: "Hafif Kar",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    73: {
        description: "Kar",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    75: {
        description: "Yoğun Kar",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    77: {
        description: "Kar Taneleri",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    80: {
        description: "Hafif Sağanak",
        dayIcon: "fa-cloud-rain",
        nightIcon: "fa-cloud-rain"
    },

    81: {
        description: "Kuvvetli Sağanak",
        dayIcon: "fa-cloud-showers-heavy",
        nightIcon: "fa-cloud-showers-heavy"
    },

    82: {
        description: "Şiddetli Sağanak",
        dayIcon: "fa-cloud-showers-heavy",
        nightIcon: "fa-cloud-showers-heavy"
    },

    85: {
        description: "Kar Sağanağı",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    86: {
        description: "Yoğun Kar Sağanağı",
        dayIcon: "fa-snowflake",
        nightIcon: "fa-snowflake"
    },

    95: {
        description: "Gök Gürültülü Fırtına",
        dayIcon: "fa-cloud-bolt",
        nightIcon: "fa-cloud-bolt"
    },

    96: {
        description: "Dolu ve Fırtına",
        dayIcon: "fa-cloud-bolt",
        nightIcon: "fa-cloud-bolt"
    },

    99: {
        description: "Şiddetli Dolu ve Fırtına",
        dayIcon: "fa-cloud-bolt",
        nightIcon: "fa-cloud-bolt"
    }
};

/* ==========================
   WEATHER INFORMATION
========================== */

function getWeatherInformation(code, isDay) {
    const weather =
        WEATHER_CODES[code] ||
        {
            description: "Bilinmiyor",
            dayIcon: "fa-cloud",
            nightIcon: "fa-cloud"
        };

    return {
        description: weather.description,

        icon:
            isDay === 1
                ? weather.dayIcon
                : weather.nightIcon
    };
}

/* ==========================
   FORMAT WEATHER TIME
========================== */

function formatWeatherTime(value) {
    if (!value) {
        return "Bilinmiyor";
    }

    const timeParts = value.split("T");

    if (timeParts.length < 2) {
        return value;
    }

    return timeParts[1].slice(0, 5);
}

/* ==========================
   GET COUNTRY WEATHER
========================== */

async function getCountryWeather(latitude, longitude) {
    const parameters = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,

        current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "weather_code",
            "wind_speed_10m",
            "is_day"
        ].join(","),

        daily: [
            "sunrise",
            "sunset"
        ].join(","),

        timezone: "auto",
        forecast_days: "1"
    });

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${parameters}`
    );

    if (!response.ok) {
        throw new Error(
            "Hava durumu bilgileri alınamadı."
        );
    }

    const data = await response.json();

    if (!data.current) {
        throw new Error(
            "Güncel hava durumu verisi bulunamadı."
        );
    }

    const weatherInformation =
        getWeatherInformation(
            data.current.weather_code,
            data.current.is_day
        );

    return {
        temperature:
            data.current.temperature_2m,

        feelsLike:
            data.current.apparent_temperature,

        humidity:
            data.current.relative_humidity_2m,

        wind:
            data.current.wind_speed_10m,

        weather:
            weatherInformation.description,

        icon:
            weatherInformation.icon,

        isDay:
            data.current.is_day,

        sunrise:
            formatWeatherTime(
                data.daily?.sunrise?.[0]
            ),

        sunset:
            formatWeatherTime(
                data.daily?.sunset?.[0]
            ),

        updatedAt:
            formatWeatherTime(
                data.current.time
            )
    };
}

/* ==========================
   RENDER COUNTRY WEATHER
========================== */

function renderCountryWeather(country, weather) {
    const section = document.querySelector(
        "#country-weather-section"
    );

    const title = document.querySelector(
        "#country-weather-title"
    );

    const content = document.querySelector(
        "#country-weather-content"
    );

    const status = document.querySelector(
        "#country-weather-status"
    );

    if (
        !section ||
        !title ||
        !content ||
        !status
    ) {
        return;
    }

    const capital =
        country.capital?.[0] ||
        country.name?.common ||
        "Başkent";

    section.hidden = false;

    title.textContent =
        `${capital} Hava Durumu`;

    status.innerHTML = "";

    content.innerHTML = `
        <div class="weather-card">

            <div class="weather-main">

                <div class="weather-icon">
                    <i class="fa-solid ${weather.icon}"></i>
                </div>

                <div class="weather-temperature">
                    <h2>
                        ${Math.round(weather.temperature)}°C
                    </h2>

                    <p>
                        ${escapeCountryHtml(weather.weather)}
                    </p>

                    <span class="weather-update-time">
                        <i class="fa-regular fa-clock"></i>

                        Son güncelleme:
                        ${escapeCountryHtml(weather.updatedAt)}
                    </span>
                </div>

            </div>

            <div class="weather-info">

                <div>
                    <i class="fa-solid fa-temperature-half"></i>

                    <span>Hissedilen</span>

                    <strong>
                        ${Math.round(weather.feelsLike)}°C
                    </strong>
                </div>

                <div>
                    <i class="fa-solid fa-droplet"></i>

                    <span>Nem</span>

                    <strong>
                        ${Math.round(weather.humidity)}%
                    </strong>
                </div>

                <div>
                    <i class="fa-solid fa-wind"></i>

                    <span>Rüzgâr</span>

                    <strong>
                        ${Math.round(weather.wind)} km/sa
                    </strong>
                </div>

                <div>
                    <i class="fa-solid fa-sun"></i>

                    <span>Gün Doğumu</span>

                    <strong>
                        ${escapeCountryHtml(weather.sunrise)}
                    </strong>
                </div>

                <div>
                    <i class="fa-solid fa-cloud-sun"></i>

                    <span>Gün Batımı</span>

                    <strong>
                        ${escapeCountryHtml(weather.sunset)}
                    </strong>
                </div>

            </div>

        </div>
    `;
}