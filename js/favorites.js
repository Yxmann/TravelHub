/* ==========================
   FAVORITES
========================== */

const FAVORITES_KEY = "travelhub-favorites";

/* ==========================
   GET FAVORITES
========================== */

function getFavorites() {
    return getStorageItem(FAVORITES_KEY, []);
}

/* ==========================
   SAVE FAVORITES
========================== */

function saveFavorites(favorites) {
    setStorageItem(FAVORITES_KEY, favorites);
}

/* ==========================
   CHECK FAVORITE
========================== */

function isFavorite(countryCode) {
    const favorites = getFavorites();

    return favorites.some(country => country.cca3 === countryCode);
}

/* ==========================
   ADD OR REMOVE FAVORITE
========================== */

function toggleFavorite(country) {
    const favorites = getFavorites();

    const countryIndex = favorites.findIndex(
        item => item.cca3 === country.cca3
    );

    if (countryIndex === -1) {
        favorites.push(country);
        saveFavorites(favorites);

        TravelToast.success(
            `${country.name.common} favorilere eklendi.`
        );

        return true;
    }

    favorites.splice(countryIndex, 1);
    saveFavorites(favorites);

    TravelToast.error(
        `${country.name.common} favorilerden kaldırıldı.`
    );

    return false;
}

/* ==========================
   UPDATE FAVORITE BUTTON
========================== */

function updateFavoriteButton(button, active) {
    const icon = button.querySelector("i");

    button.classList.toggle("active", active);

    if (!icon) {
        return;
    }

    icon.classList.toggle("fa-regular", !active);
    icon.classList.toggle("fa-solid", active);
}

/* ==========================
   FAVORITES PAGE
========================== */

const favoritesContainer = document.querySelector("#favorites-container");
const favoritesStatus = document.querySelector("#favorites-status");

function renderFavorites() {
    if (!favoritesContainer || !favoritesStatus) {
        return;
    }

    const favorites = getFavorites();

    favoritesContainer.innerHTML = "";
    favoritesStatus.innerHTML = "";

    if (favorites.length === 0) {
        favoritesStatus.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-heart"></i>
                <h3>Henüz favori ülken yok</h3>
                <p>
                    Ülkeler sayfasından beğendiğin ülkeleri favorilere ekleyebilirsin.
                </p>

                <a href="countries.html" class="btn-primary">
                    Ülkeleri Keşfet
                </a>
            </div>
        `;

        return;
    }

    favorites.forEach(country => {
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
                        class="favorite-btn active"
                        data-code="${country.cca3}"
                        aria-label="${country.name.common} ülkesini favorilerden kaldır"
                    >
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        favoritesContainer.appendChild(card);
    });
}

/* ==========================
   FAVORITES PAGE ACTIONS
========================== */

favoritesContainer?.addEventListener("click", event => {
    const detailsButton = event.target.closest(".details-btn");

    if (detailsButton) {
        const countryCode = detailsButton.dataset.code;

        window.location.href = `country.html?code=${countryCode}`;
        return;
    }

    const favoriteButton = event.target.closest(".favorite-btn");

    if (!favoriteButton) {
        return;
    }

    const countryCode = favoriteButton.dataset.code;

    const selectedCountry = getFavorites().find(
        country => country.cca3 === countryCode
    );

    if (!selectedCountry) {
        return;
    }

    toggleFavorite(selectedCountry);
    renderFavorites();
});

/* ==========================
   START FAVORITES PAGE
========================== */

renderFavorites();