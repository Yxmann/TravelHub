/* ==========================
   COUNTRY TRAVEL INFO
========================== */

let countryLocalTimeInterval = null;

/* ==========================
   MONTH NAMES
========================== */

const TURKISH_MONTH_NAMES = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık"
];

/* ==========================
   VISIT TIME RULES
========================== */

const COUNTRY_VISIT_TIME_OVERRIDES = {
    TUR: {
        title: "Nisan – Haziran ve Eylül – Ekim",
        description:
            "Ilıman hava, daha az yoğunluk ve şehir gezileri için en uygun dönemlerdir."
    },

    JPN: {
        title: "Mart – Mayıs ve Ekim – Kasım",
        description:
            "İlkbaharda kiraz çiçekleri, sonbaharda ise renkli doğa manzaraları öne çıkar."
    },

    ISL: {
        title: "Haziran – Ağustos",
        description:
            "Uzun gündüz süreleri ve daha ulaşılabilir yollar nedeniyle yaz ayları daha uygundur."
    },

    NOR: {
        title: "Mayıs – Eylül",
        description:
            "Fiyort gezileri, doğa yürüyüşleri ve daha uzun gündüz saatleri için ideal dönemdir."
    },

    FIN: {
        title: "Haziran – Ağustos veya Aralık – Mart",
        description:
            "Yaz ayları doğa gezileri, kış ayları ise kar aktiviteleri ve kuzey ışıkları için uygundur."
    },

    THA: {
        title: "Kasım – Şubat",
        description:
            "Daha serin, daha kuru ve açık hava aktiviteleri için daha konforlu bir dönemdir."
    },

    IDN: {
        title: "Mayıs – Eylül",
        description:
            "Yağışın daha az olduğu kuru sezon, plaj ve doğa gezileri için daha uygundur."
    },

    BRA: {
        title: "Nisan – Haziran ve Ağustos – Ekim",
        description:
            "Aşırı sıcak ve yoğun yağışların daha sınırlı olduğu geçiş dönemleri tercih edilebilir."
    },

    ARG: {
        title: "Ekim – Nisan",
        description:
            "Güney yarımkürede ilkbahar ve yaz dönemi, şehir ve doğa gezileri için daha uygundur."
    },

    AUS: {
        title: "Eylül – Kasım ve Mart – Mayıs",
        description:
            "Ilıman hava ve daha dengeli sıcaklıklar nedeniyle ilkbahar ve sonbahar öne çıkar."
    },

    NZL: {
        title: "Aralık – Mart",
        description:
            "Güney yarımkürede yaz dönemi, doğa gezileri ve açık hava aktiviteleri için uygundur."
    },

    EGY: {
        title: "Ekim – Nisan",
        description:
            "Daha serin hava sayesinde tarihi bölgeleri ve şehirleri gezmek daha rahat olur."
    },

    MAR: {
        title: "Mart – Mayıs ve Eylül – Kasım",
        description:
            "Yazın aşırı sıcaklarından kaçınmak için ilkbahar ve sonbahar daha uygundur."
    },

    ZAF: {
        title: "Eylül – Kasım ve Mart – Mayıs",
        description:
            "Ilıman hava, şehir gezileri ve doğa aktiviteleri için dengeli dönemlerdir."
    }
};

/* ==========================
   GET BEST VISIT TIME
========================== */

function getBestVisitTime(country) {
    const override =
        COUNTRY_VISIT_TIME_OVERRIDES[country.cca3];

    if (override) {
        return override;
    }

    const latitude =
        Number(country.latlng?.[0]);

    const region =
        country.region || "";

    const subregion =
        country.subregion || "";

    if (!Number.isFinite(latitude)) {
        return {
            title: "İlkbahar ve Sonbahar",
            description:
                "Aşırı sıcak ve yoğun dönemlerden kaçınmak için geçiş mevsimleri genellikle daha uygundur."
        };
    }

    if (
        latitude >= 45 ||
        subregion.includes("Northern Europe")
    ) {
        return {
            title: "Mayıs – Eylül",
            description:
                "Daha ılıman hava ve uzun gündüz süreleri nedeniyle yaz dönemi daha uygundur."
        };
    }

    if (
        latitude <= -35 ||
        subregion.includes("Australia and New Zealand")
    ) {
        return {
            title: "Ekim – Nisan",
            description:
                "Güney yarımkürede ilkbahar ve yaz ayları açık hava gezileri için daha uygundur."
        };
    }

    if (
        region === "Africa" ||
        subregion.includes("Western Asia")
    ) {
        return {
            title: "Ekim – Nisan",
            description:
                "Daha serin ve daha konforlu hava koşulları nedeniyle sonbahar ile ilkbahar arası tercih edilebilir."
        };
    }

    if (
        Math.abs(latitude) <= 23.5
    ) {
        return {
            title: "Kuru Sezon",
            description:
                "Yağışın daha az olduğu dönem, plajlar ve açık hava aktiviteleri için genellikle daha uygundur."
        };
    }

    return {
        title: "Nisan – Haziran ve Eylül – Ekim",
        description:
            "Ilıman hava, daha az yoğunluk ve şehir gezileri için geçiş mevsimleri genellikle uygundur."
    };
}

/* ==========================
   PARSE UTC OFFSET
========================== */

function parseUtcOffset(timezone) {
    if (!timezone) {
        return null;
    }

    if (timezone === "UTC") {
        return 0;
    }

    const match = timezone.match(
        /^UTC([+-])(\d{2}):?(\d{2})?$/
    );

    if (!match) {
        return null;
    }

    const sign =
        match[1] === "-" ? -1 : 1;

    const hours =
        Number(match[2]);

    const minutes =
        Number(match[3] || 0);

    return sign * (
        hours * 60 + minutes
    );
}

/* ==========================
   FORMAT TIMEZONE LABEL
========================== */

function formatTimezoneLabel(timezone) {
    if (!timezone) {
        return "Saat dilimi bilinmiyor";
    }

    if (timezone === "UTC") {
        return "UTC";
    }

    return timezone.replace(
        "UTC",
        "UTC "
    );
}

/* ==========================
   GET COUNTRY LOCAL DATE
========================== */

function getCountryLocalDate(
    timezone,
    currentDate = new Date()
) {
    const offsetMinutes =
        parseUtcOffset(timezone);

    if (offsetMinutes === null) {
        return null;
    }

    const utcMilliseconds =
        currentDate.getTime() +
        currentDate.getTimezoneOffset() *
        60 *
        1000;

    return new Date(
        utcMilliseconds +
        offsetMinutes *
        60 *
        1000
    );
}

/* ==========================
   FORMAT LOCAL TIME
========================== */

function formatLocalTime(date) {
    return [
        String(date.getHours()).padStart(
            2,
            "0"
        ),

        String(date.getMinutes()).padStart(
            2,
            "0"
        ),

        String(date.getSeconds()).padStart(
            2,
            "0"
        )
    ].join(":");
}

/* ==========================
   FORMAT LOCAL DATE
========================== */

function formatLocalDate(date) {
    const day =
        String(date.getDate()).padStart(
            2,
            "0"
        );

    const month =
        TURKISH_MONTH_NAMES[
            date.getMonth()
        ];

    const year =
        date.getFullYear();

    const weekday =
        date.toLocaleDateString(
            "tr-TR",
            {
                weekday: "long"
            }
        );

    return `${day} ${month} ${year}, ${weekday}`;
}

/* ==========================
   UPDATE LOCAL TIME
========================== */

function updateCountryLocalTime(country) {
    const timeElement =
        document.querySelector(
            "#country-local-time"
        );

    const dateElement =
        document.querySelector(
            "#country-local-date"
        );

    const timezoneElement =
        document.querySelector(
            "#country-timezone-label"
        );

    if (
        !timeElement ||
        !dateElement ||
        !timezoneElement
    ) {
        return;
    }

    const timezone =
        country.timezones?.[0];

    const localDate =
        getCountryLocalDate(timezone);

    if (!localDate) {
        timeElement.textContent = "--:--";
        dateElement.textContent =
            "Yerel tarih hesaplanamadı.";

        timezoneElement.textContent =
            formatTimezoneLabel(timezone);

        return;
    }

    timeElement.textContent =
        formatLocalTime(localDate);

    dateElement.textContent =
        formatLocalDate(localDate);

    timezoneElement.textContent =
        formatTimezoneLabel(timezone);
}

/* ==========================
   START LOCAL TIME
========================== */

function startCountryLocalTime(country) {
    if (countryLocalTimeInterval) {
        clearInterval(
            countryLocalTimeInterval
        );
    }

    updateCountryLocalTime(country);

    countryLocalTimeInterval =
        setInterval(
            () => {
                updateCountryLocalTime(
                    country
                );
            },
            1000
        );
}

/* ==========================
   RENDER TRAVEL INFO
========================== */

function renderCountryTravelInfo(country) {
    const section =
        document.querySelector(
            "#country-travel-info-section"
        );

    const title =
        document.querySelector(
            "#country-travel-info-title"
        );

    const visitTimeElement =
        document.querySelector(
            "#best-visit-time"
        );

    const visitDescriptionElement =
        document.querySelector(
            "#best-visit-description"
        );

    const status =
        document.querySelector(
            "#country-travel-info-status"
        );

    if (
        !section ||
        !title ||
        !visitTimeElement ||
        !visitDescriptionElement ||
        !status
    ) {
        return;
    }

    const visitTime =
        getBestVisitTime(country);

    section.hidden = false;

    title.textContent =
        `${country.name.common} Seyahat Bilgileri`;

    status.innerHTML = "";

    visitTimeElement.textContent =
        visitTime.title;

    visitDescriptionElement.textContent =
        visitTime.description;

    startCountryLocalTime(country);
}

/* ==========================
   CLEANUP
========================== */

window.addEventListener(
    "beforeunload",
    () => {
        if (countryLocalTimeInterval) {
            clearInterval(
                countryLocalTimeInterval
            );
        }
    }
);