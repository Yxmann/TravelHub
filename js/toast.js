/* ==========================
   TRAVELHUB TOAST SYSTEM
========================== */

window.TravelToast = {
    container: null,

    getContainer() {
        if (this.container && document.body.contains(this.container)) {
            return this.container;
        }

        this.container = document.createElement("div");
        this.container.className = "travel-toast-container";
        this.container.setAttribute("aria-live", "polite");

        document.body.appendChild(this.container);

        return this.container;
    },

    show(message, type = "info", duration = 3500) {
        if (!message) {
            return;
        }

        const icons = {
            success: "fa-solid fa-circle-check",
            error: "fa-solid fa-circle-xmark",
            warning: "fa-solid fa-triangle-exclamation",
            info: "fa-solid fa-circle-info"
        };

        const container = this.getContainer();
        const toast = document.createElement("div");

        toast.className = `travel-toast travel-toast-${type}`;

        const safeMessage = document.createElement("span");
        safeMessage.textContent = message;

        toast.innerHTML = `
            <div class="travel-toast-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>

            <p class="travel-toast-message"></p>

            <button
                class="travel-toast-close"
                type="button"
                aria-label="Bildirimi kapat"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="travel-toast-progress"></div>
        `;

        toast.querySelector(".travel-toast-message").textContent =
            safeMessage.textContent;

        const progress = toast.querySelector(".travel-toast-progress");
        progress.style.animationDuration = `${duration}ms`;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("travel-toast-visible");
        });

        const remove = () => {
            if (toast.classList.contains("travel-toast-removing")) {
                return;
            }

            toast.classList.add("travel-toast-removing");
            toast.classList.remove("travel-toast-visible");

            setTimeout(() => {
                toast.remove();
            }, 300);
        };

        toast
            .querySelector(".travel-toast-close")
            .addEventListener("click", remove);

        setTimeout(remove, duration);
    },

    success(message, duration) {
        this.show(message, "success", duration);
    },

    error(message, duration) {
        this.show(message, "error", duration);
    },

    warning(message, duration) {
        this.show(message, "warning", duration);
    },

    info(message, duration) {
        this.show(message, "info", duration);
    }
};