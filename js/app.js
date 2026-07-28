/* ==========================
   APP
========================== */

const menuButton = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-links, .nav-menu");
const header = document.querySelector("header");

/* ==========================
   MOBILE MENU HELPERS
========================== */

function updateMenuIcon(isOpen) {
    if (!menuButton) {
        return;
    }

    const icon = menuButton.querySelector("i");

    if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
    }

    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Menüyü Kapat" : "Menüyü Aç"
    );

    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
}

function closeMobileMenu() {
    if (!navMenu) {
        return;
    }

    navMenu.classList.remove("active");
    updateMenuIcon(false);
}

/* ==========================
   MOBILE MENU
========================== */

menuButton?.addEventListener("click", event => {
    event.stopPropagation();

    if (!navMenu) {
        return;
    }

    navMenu.classList.toggle("active");

    const isMenuOpen =
        navMenu.classList.contains("active");

    updateMenuIcon(isMenuOpen);

    if (isMenuOpen) {
        header?.classList.remove("header-hidden");
    }
});

/* ==========================
   CLOSE MENU WHEN CLICK LINK
========================== */

document
    .querySelectorAll(".nav-links a, .nav-menu a")
    .forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

/* ==========================
   CLOSE MENU WHEN CLICK OUTSIDE
========================== */

document.addEventListener("click", event => {
    if (!navMenu || !menuButton) {
        return;
    }

    const clickedInsideMenu =
        navMenu.contains(event.target);

    const clickedMenuButton =
        menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
        closeMobileMenu();
    }
});

/* ==========================
   CLOSE MENU WITH ESCAPE
========================== */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMobileMenu();
    }
});

/* ==========================
   CLOSE MENU WHEN SCREEN GROWS
========================== */

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
        header?.classList.remove("header-hidden");
    }
});

/* ==========================
   MOBILE HEADER SCROLL
========================== */

let lastScrollY = window.scrollY;

window.addEventListener(
    "scroll",
    () => {
        if (!header) {
            return;
        }

        const currentScrollY = Math.max(window.scrollY, 0);

        // Masaüstünde her zaman göster
        if (window.innerWidth > 768) {
            header.classList.remove("header-hidden");
            lastScrollY = currentScrollY;
            return;
        }

        const menuIsOpen =
            navMenu?.classList.contains("active");

        // Menü açıksa veya sayfanın üstündeysek göster
        if (menuIsOpen || currentScrollY < 50) {
            header.classList.remove("header-hidden");
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > lastScrollY) {
            // Aşağı kaydırınca gizle
            header.classList.add("header-hidden");
        } else if (currentScrollY < lastScrollY) {
            // Yukarı doğru en küçük harekette göster
            header.classList.remove("header-hidden");
        }

        lastScrollY = currentScrollY;
    },
    { passive: true }
);

/* ==========================
   ACTIVE NAVIGATION
========================== */

const currentPage =
    window.location.pathname
        .split("/")
        .pop() || "index.html";

document
    .querySelectorAll(".nav-links a, .nav-menu a")
    .forEach(link => {
        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        const linkPage =
            href.split("/").pop();

        if (linkPage === currentPage) {
            document
                .querySelectorAll(
                    ".nav-links a, .nav-menu a"
                )
                .forEach(item => {
                    item.classList.remove("active");
                });

            link.classList.add("active");
        }
    });