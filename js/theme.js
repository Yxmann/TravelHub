/* ==========================
   THEME
========================== */

const themeButton = document.querySelector(".theme-btn, .theme-toggle");
const themeIcon = themeButton?.querySelector("i");

const savedTheme = localStorage.getItem("theme");

function updateThemeIcon(isDark) {
    if (!themeIcon) return;

    if (isDark) {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
}

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
} else {
    document.body.classList.remove("dark-mode");
    updateThemeIcon(false);
}

themeButton?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeIcon(isDark);
});