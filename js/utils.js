/* ==========================
   TRAVELHUB UTILITIES
========================== */

/**
 * Bir elementi CSS seçicisiyle bulur.
 * Element bulunamazsa null döndürür.
 */
function selectElement(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Birden fazla elementi CSS seçicisiyle bulur.
 * Sonucu normal bir dizi olarak döndürür.
 */
function selectElements(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

/**
 * LocalStorage içerisinden veri okur.
 * Veri bulunamazsa varsayılan değeri döndürür.
 */
function getStorageItem(key, defaultValue = null) {
    try {
        const storedValue = localStorage.getItem(key);

        if (storedValue === null) {
            return defaultValue;
        }

        return JSON.parse(storedValue);
    } catch (error) {
        console.error(`"${key}" verisi okunamadı:`, error);
        return defaultValue;
    }
}

/**
 * LocalStorage içerisine veri kaydeder.
 */
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`"${key}" verisi kaydedilemedi:`, error);
        return false;
    }
}

/**
 * LocalStorage içerisinden veri siler.
 */
function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`"${key}" verisi silinemedi:`, error);
        return false;
    }
}

/**
 * Bir metindeki Türkçe karakterleri düzenleyerek
 * küçük harfli arama metni oluşturur.
 */
function normalizeText(text = "") {
    return text
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/**
 * Kullanıcıya kısa süreli bildirim gösterir.
 */
function showToast(message, type = "success") {
    const oldToast = selectElement(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");

    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("toast-show");
    });

    setTimeout(() => {
        toast.classList.remove("toast-show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}

/**
 * API isteklerinde kullanılacak ortak yardımcı fonksiyon.
 */
async function fetchData(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`İstek başarısız oldu: ${response.status}`);
    }

    return response.json();
}