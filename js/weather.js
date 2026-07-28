/* ==========================
   WEATHER
========================== */

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");

const weatherMessage = document.getElementById("weather-message");
const weatherCard = document.getElementById("weather-card");
const weatherError = document.getElementById("weather-error");

const weatherCountry = document.getElementById("weather-country");
const weatherCity = document.getElementById("weather-city");
const weatherIcon = document.getElementById("weather-icon");
const weatherTemperature = document.getElementById("weather-temperature");
const weatherDescription = document.getElementById("weather-description");
const weatherFeelsLike = document.getElementById("weather-feels-like");
const weatherHumidity = document.getElementById("weather-humidity");
const weatherWind = document.getElementById("weather-wind");

weatherForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cityName = cityInput.value.trim();

    if (!cityName) {
        showError();
        return;
    }

    hideAllWeatherAreas();

    try {
        const location = await getCityLocation(cityName);

        if (!location) {
            showError();
            return;
        }

        const weatherData = await getWeatherData(
            location.latitude,
            location.longitude
        );

        showWeather(location, weatherData);
    } catch (error) {
        console.error("Hava durumu alınamadı:", error);
        showError();
    }
});

async function getCityLocation(cityName) {
    const geocodingURL =
        `https://geocoding-api.open-meteo.com/v1/search` +
        `?name=${encodeURIComponent(cityName)}` +
        `&count=1` +
        `&language=tr` +
        `&format=json`;

    const response = await fetch(geocodingURL);

    if (!response.ok) {
        throw new Error("Şehir bilgisi alınamadı.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        return null;
    }

    return data.results[0];
}

async function getWeatherData(latitude, longitude) {
    const weatherURL =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&wind_speed_unit=kmh` +
        `&timezone=auto`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
        throw new Error("Hava durumu alınamadı.");
    }

    const data = await response.json();

    return data.current;
}

function showWeather(location, currentWeather) {
    weatherCountry.textContent = createLocationText(location);
    weatherCity.textContent = location.name;

    weatherTemperature.textContent = Math.round(
        currentWeather.temperature_2m
    );

    weatherFeelsLike.textContent =
        `${Math.round(currentWeather.apparent_temperature)}°C`;

    weatherHumidity.textContent =
        `%${currentWeather.relative_humidity_2m}`;

    weatherWind.textContent =
        `${Math.round(currentWeather.wind_speed_10m)} km/sa`;

    const weatherInfo = getWeatherInfo(currentWeather.weather_code);

    weatherDescription.textContent = weatherInfo.description;

    weatherIcon.innerHTML = `
        <i class="fa-solid ${weatherInfo.icon}"></i>
    `;

    weatherMessage.classList.add("hidden");
    weatherError.classList.add("hidden");
    weatherCard.classList.remove("hidden");
}

function createLocationText(location) {
    const locationParts = [];

    if (location.admin1) {
        locationParts.push(location.admin1);
    }

    if (location.country) {
        locationParts.push(location.country);
    }

    return locationParts.join(", ");
}

function getWeatherInfo(weatherCode) {
    const weatherConditions = {
        0: {
            description: "Açık",
            icon: "fa-sun"
        },

        1: {
            description: "Çoğunlukla açık",
            icon: "fa-sun"
        },

        2: {
            description: "Parçalı bulutlu",
            icon: "fa-cloud-sun"
        },

        3: {
            description: "Kapalı",
            icon: "fa-cloud"
        },

        45: {
            description: "Sisli",
            icon: "fa-smog"
        },

        48: {
            description: "Kırağılı sis",
            icon: "fa-smog"
        },

        51: {
            description: "Hafif çisenti",
            icon: "fa-cloud-rain"
        },

        53: {
            description: "Çisenti",
            icon: "fa-cloud-rain"
        },

        55: {
            description: "Yoğun çisenti",
            icon: "fa-cloud-showers-heavy"
        },

        61: {
            description: "Hafif yağmur",
            icon: "fa-cloud-rain"
        },

        63: {
            description: "Yağmurlu",
            icon: "fa-cloud-showers-heavy"
        },

        65: {
            description: "Şiddetli yağmur",
            icon: "fa-cloud-showers-heavy"
        },

        71: {
            description: "Hafif kar",
            icon: "fa-snowflake"
        },

        73: {
            description: "Karlı",
            icon: "fa-snowflake"
        },

        75: {
            description: "Yoğun kar",
            icon: "fa-snowflake"
        },

        80: {
            description: "Hafif sağanak",
            icon: "fa-cloud-rain"
        },

        81: {
            description: "Sağanak yağışlı",
            icon: "fa-cloud-showers-heavy"
        },

        82: {
            description: "Şiddetli sağanak",
            icon: "fa-cloud-showers-heavy"
        },

        95: {
            description: "Gök gürültülü",
            icon: "fa-cloud-bolt"
        },

        96: {
            description: "Dolu ve gök gürültüsü",
            icon: "fa-cloud-bolt"
        },

        99: {
            description: "Şiddetli dolu ve fırtına",
            icon: "fa-cloud-bolt"
        }
    };

    return weatherConditions[weatherCode] || {
        description: "Hava durumu bilgisi",
        icon: "fa-cloud-sun"
    };
}

function hideAllWeatherAreas() {
    weatherMessage.classList.add("hidden");
    weatherCard.classList.add("hidden");
    weatherError.classList.add("hidden");
}

function showError() {
    weatherMessage.classList.add("hidden");
    weatherCard.classList.add("hidden");
    weatherError.classList.remove("hidden");
}