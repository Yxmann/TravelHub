/* ==========================
   APP
========================== */

const menuButton = document.querySelector(".menu-btn");

const navMenu = document.querySelector(
    ".nav-links, .nav-menu"
);

const header = document.querySelector(
    "header, .header, .navbar"
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

    if (isMenuOpen) {
        header?.classList.remove("header-hidden");
    }
});

/* ==========================
   CLOSE MOBILE MENU
========================== */

function closeMobileMenu() {
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
}

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

    const clickedInsideMenu = navMenu.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
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
let upwardScrollDistance = 0;
let scrollTicking = false;

function handleHeaderScroll() {
    if (!header || window.innerWidth > 768) {
        header?.classList.remove("header-hidden");

        lastScrollY = window.scrollY;
        upwardScrollDistance = 0;
        scrollTicking = false;

        return;
    }

    const currentScrollY = Math.max(window.scrollY, 0);
    const scrollDifference = currentScrollY - lastScrollY;
    const isMenuOpen = navMenu?.classList.contains("active");

    if (isMenuOpen || currentScrollY <= 20) {
        header.classList.remove("header-hidden");
        upwardScrollDistance = 0;
    } else if (scrollDifference > 0) {
        upwardScrollDistance = 0;

        if (currentScrollY > 100) {
            header.classList.add("header-hidden");
        }
    } else if (scrollDifference < 0) {
        upwardScrollDistance += Math.abs(scrollDifference);

        if (upwardScrollDistance >= 25) {
            header.classList.remove("header-hidden");
            upwardScrollDistance = 0;
        }
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(handleHeaderScroll);
            scrollTicking = true;
        }
    },
    { passive: true }
);

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
