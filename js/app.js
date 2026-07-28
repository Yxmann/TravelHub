/* ==========================
   APP
========================== */

const menuButton = document.querySelector(".menu-btn");

const navMenu = document.querySelector(
    ".nav-links, .nav-menu"
);

/* ==========================
   MOBILE MENU
========================== */

menuButton?.addEventListener("click", () => {
    if (!navMenu) {
        return;
    }

    navMenu.classList.toggle("active");

    const icon = menuButton.querySelector("i");

    if (!icon) {
        return;
    }

    const isMenuOpen = navMenu.classList.contains("active");

    icon.classList.toggle("fa-bars", !isMenuOpen);
    icon.classList.toggle("fa-xmark", isMenuOpen);

    menuButton.setAttribute(
        "aria-label",
        isMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"
    );

    menuButton.setAttribute(
        "aria-expanded",
        String(isMenuOpen)
    );
});

/* ==========================
   CLOSE MENU WHEN CLICK LINK
========================== */

document
    .querySelectorAll(".nav-links a, .nav-menu a")
    .forEach(link => {
        link.addEventListener("click", () => {
            if (!navMenu || !menuButton) {
                return;
            }

            navMenu.classList.remove("active");

            const icon = menuButton.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }

            menuButton.setAttribute("aria-label", "Menüyü Aç");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });

/* ==========================
   CLOSE MENU WHEN CLICK OUTSIDE
========================== */

document.addEventListener("click", event => {
    if (!navMenu || !menuButton) {
        return;
    }

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
        navMenu.classList.remove("active");

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        menuButton.setAttribute("aria-label", "Menüyü Aç");
        menuButton.setAttribute("aria-expanded", "false");
    }
});

/* ==========================
   CLOSE MENU WHEN SCREEN GROWS
========================== */

window.addEventListener("resize", () => {
    if (
        window.innerWidth > 768 &&
        navMenu &&
        menuButton
    ) {
        navMenu.classList.remove("active");

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        menuButton.setAttribute("aria-label", "Menüyü Aç");
        menuButton.setAttribute("aria-expanded", "false");
    }
});

/* ==========================
   ACTIVE NAVIGATION
========================== */

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

document
    .querySelectorAll(".nav-links a, .nav-menu a")
    .forEach(link => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        const linkPage = href.split("/").pop();

        if (linkPage === currentPage) {
            document
                .querySelectorAll(".nav-links a, .nav-menu a")
                .forEach(item => item.classList.remove("active"));

            link.classList.add("active");
        }
    });