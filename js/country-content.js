/* ==========================
   COUNTRY GUIDE CONTENT
========================== */

/*
    Bu dosya ülkeye ait:

    - Ünlü yemekleri
    - Gezilecek yerleri
    - Yapılacak aktiviteleri

    Wikipedia API üzerinden bulur.
*/

const COUNTRY_GUIDE_CONFIG = {
    foods: {
        label: "Ünlü Yemekler",
        icon: "fa-utensils",

        queries: [
            countryName => `${countryName} cuisine traditional dishes`,
            countryName => `${countryName} food`,
            countryName => `Cuisine of ${countryName}`
        ],

        fallbackDescription:
            "Bu ülkenin mutfağında öne çıkan geleneksel lezzetlerden biri."
    },

    places: {
        label: "Gezilecek Yerler",
        icon: "fa-location-dot",

        queries: [
            countryName => `Tourist attractions in ${countryName}`,
            countryName => `${countryName} landmarks`,
            countryName => `${countryName} tourism`
        ],

        fallbackDescription:
            "Ülkede ziyaret edilebilecek önemli turistik noktalardan biri."
    },

    activities: {
        label: "Yapılacak Şeyler",
        icon: "fa-person-hiking",

        queries: [
            countryName => `Things to do in ${countryName}`,
            countryName => `${countryName} culture festival`,
            countryName => `${countryName} national park tourism`
        ],

        fallbackDescription:
            "Bu ülkede deneyimleyebileceğin popüler etkinliklerden biri."
    }
};

/* ==========================
   SPECIAL COUNTRY NAMES
========================== */

/*
    Bazı ülke isimlerinin İngilizce Wikipedia aramalarında
    daha doğru sonuç vermesi için özel karşılıkları.
*/

const COUNTRY_SEARCH_NAMES = {
    TUR: "Turkey",
    USA: "United States",
    GBR: "United Kingdom",
    ARE: "United Arab Emirates",
    CZE: "Czech Republic",
    KOR: "South Korea",
    PRK: "North Korea",
    RUS: "Russia",
    IRN: "Iran",
    SYR: "Syria",
    LAO: "Laos",
    BOL: "Bolivia",
    VEN: "Venezuela",
    TZA: "Tanzania",
    VNM: "Vietnam",
    MDA: "Moldova",
    BRN: "Brunei",
    CPV: "Cape Verde",
    CIV: "Ivory Coast",
    COD: "Democratic Republic of the Congo",
    COG: "Republic of the Congo",
    SWZ: "Eswatini",
    MKD: "North Macedonia",
    TLS: "East Timor",
    PSE: "Palestine",
    VAT: "Vatican City",
    TWN: "Taiwan"
};

/* ==========================
   CURATED CONTENT
========================== */

/*
    En çok ziyaret edilen ülkeler için daha doğru sonuçlar
    gösterilmesi amacıyla özel arama başlıkları kullanıyoruz.

    Diğer ülkeler otomatik arama sistemini kullanır.
*/

const CURATED_COUNTRY_GUIDE = {
    TUR: {
        foods: [
            "Baklava",
            "Mantı",
            "Adana kebabı"
        ],

        places: [
            "Cappadocia",
            "Hagia Sophia",
            "Pamukkale"
        ],

        activities: [
            "Hot air ballooning in Cappadocia",
            "Bosphorus cruise",
            "Turkish bath"
        ]
    },

    JPN: {
        foods: [
            "Sushi",
            "Ramen",
            "Tempura"
        ],

        places: [
            "Mount Fuji",
            "Fushimi Inari-taisha",
            "Tokyo Tower"
        ],

        activities: [
            "Hanami",
            "Onsen",
            "Shinkansen"
        ]
    },

    ITA: {
        foods: [
            "Pizza",
            "Pasta",
            "Gelato"
        ],

        places: [
            "Colosseum",
            "Grand Canal Venice",
            "Leaning Tower of Pisa"
        ],

        activities: [
            "Gondola",
            "Wine tourism in Italy",
            "Italian cooking"
        ]
    },

    FRA: {
        foods: [
            "Croissant",
            "Crêpe",
            "Ratatouille"
        ],

        places: [
            "Eiffel Tower",
            "Palace of Versailles",
            "Mont Saint-Michel"
        ],

        activities: [
            "Seine river cruise",
            "Wine tourism in France",
            "French cuisine"
        ]
    },

    ESP: {
        foods: [
            "Paella",
            "Churro",
            "Tapas"
        ],

        places: [
            "Sagrada Família",
            "Alhambra",
            "Park Güell"
        ],

        activities: [
            "Flamenco",
            "Camino de Santiago",
            "La Tomatina"
        ]
    },

    DEU: {
        foods: [
            "Bratwurst",
            "Pretzel",
            "Black Forest cake"
        ],

        places: [
            "Brandenburg Gate",
            "Neuschwanstein Castle",
            "Cologne Cathedral"
        ],

        activities: [
            "Oktoberfest",
            "Rhine cruise",
            "Christmas market"
        ]
    },

    GBR: {
        foods: [
            "Fish and chips",
            "Full English breakfast",
            "Shepherd's pie"
        ],

        places: [
            "Big Ben",
            "Tower Bridge",
            "Stonehenge"
        ],

        activities: [
            "Afternoon tea",
            "West End theatre",
            "London sightseeing"
        ]
    },

    USA: {
        foods: [
            "Hamburger",
            "Barbecue",
            "Apple pie"
        ],

        places: [
            "Statue of Liberty",
            "Grand Canyon",
            "Golden Gate Bridge"
        ],

        activities: [
            "Road trip",
            "Broadway theatre",
            "National parks of the United States"
        ]
    },

    BRA: {
        foods: [
            "Feijoada",
            "Brigadeiro",
            "Pão de queijo"
        ],

        places: [
            "Christ the Redeemer",
            "Iguaçu Falls",
            "Sugarloaf Mountain"
        ],

        activities: [
            "Brazilian Carnival",
            "Samba",
            "Amazon rainforest tourism"
        ]
    },

    CAN: {
        foods: [
            "Poutine",
            "Butter tart",
            "Tourtière"
        ],

        places: [
            "Niagara Falls",
            "Banff National Park",
            "CN Tower"
        ],

        activities: [
            "Whale watching in Canada",
            "Skiing in Canada",
            "Canadian Rockies"
        ]
    },

    NOR: {
        foods: [
            "Fårikål",
            "Lefse",
            "Norwegian salmon"
        ],

        places: [
            "Geirangerfjord",
            "Lofoten",
            "Bryggen"
        ],

        activities: [
            "Northern lights",
            "Norwegian fjords",
            "Hiking in Norway"
        ]
    },

    GRC: {
        foods: [
            "Moussaka",
            "Souvlaki",
            "Baklava"
        ],

        places: [
            "Acropolis of Athens",
            "Santorini",
            "Meteora"
        ],

        activities: [
            "Greek island hopping",
            "Sailing in Greece",
            "Greek cuisine"
        ]
    },

    EGY: {
        foods: [
            "Koshary",
            "Ful medames",
            "Molokhia"
        ],

        places: [
            "Giza pyramid complex",
            "Valley of the Kings",
            "Abu Simbel"
        ],

        activities: [
            "Nile cruise",
            "Red Sea diving",
            "Desert safari"
        ]
    },

    THA: {
        foods: [
            "Pad Thai",
            "Tom yum",
            "Green curry"
        ],

        places: [
            "Grand Palace",
            "Wat Arun",
            "Phi Phi Islands"
        ],

        activities: [
            "Thai massage",
            "Floating market",
            "Songkran"
        ]
    },

    IND: {
        foods: [
            "Biryani",
            "Butter chicken",
            "Samosa"
        ],

        places: [
            "Taj Mahal",
            "Hawa Mahal",
            "Gateway of India"
        ],

        activities: [
            "Holi",
            "Yoga tourism",
            "Indian safari"
        ]
    },

    CHN: {
        foods: [
            "Peking duck",
            "Dim sum",
            "Hot pot"
        ],

        places: [
            "Great Wall of China",
            "Forbidden City",
            "Terracotta Army"
        ],

        activities: [
            "Yangtze cruise",
            "Chinese tea ceremony",
            "Chinese New Year"
        ]
    },

    MEX: {
        foods: [
            "Taco",
            "Tamale",
            "Churro"
        ],

        places: [
            "Chichen Itza",
            "Palacio de Bellas Artes",
            "Tulum"
        ],

        activities: [
            "Day of the Dead",
            "Cenote diving",
            "Lucha libre"
        ]
    },

    AUS: {
        foods: [
            "Meat pie",
            "Pavlova",
            "Lamington"
        ],

        places: [
            "Sydney Opera House",
            "Great Barrier Reef",
            "Uluru"
        ],

        activities: [
            "Surfing in Australia",
            "Great Barrier Reef diving",
            "Australian wildlife tourism"
        ]
    }
};

/* ==========================
   GET SEARCH COUNTRY NAME
========================== */

function getCountrySearchName(country) {
    return (
        COUNTRY_SEARCH_NAMES[country.cca3] ||
        country.englishName ||
        country.name?.common ||
        ""
    );
}

/* ==========================
   BUILD API URL
========================== */

function buildWikipediaApiUrl(parameters) {
    const apiUrl = new URL(
        "https://en.wikipedia.org/w/api.php"
    );

    Object.entries(parameters).forEach(
        ([key, value]) => {
            apiUrl.searchParams.set(key, value);
        }
    );

    apiUrl.searchParams.set("origin", "*");
    apiUrl.searchParams.set("format", "json");
    apiUrl.searchParams.set("formatversion", "2");

    return apiUrl.toString();
}

/* ==========================
   SEARCH WIKIPEDIA
========================== */

async function searchWikipedia(query, limit = 6) {
    const url = buildWikipediaApiUrl({
        action: "query",
        generator: "search",

        gsrsearch: query,
        gsrnamespace: "0",
        gsrlimit: String(limit),

        prop: "extracts|pageimages|info",

        exintro: "1",
        explaintext: "1",
        exsentences: "2",

        piprop: "thumbnail|original",
        pithumbsize: "700",

        inprop: "url"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Wikipedia isteği başarısız: ${response.status}`
        );
    }

    const data = await response.json();

    return data.query?.pages || [];
}

/* ==========================
   GET EXACT WIKIPEDIA PAGE
========================== */

async function getWikipediaPage(title) {
    const url = buildWikipediaApiUrl({
        action: "query",

        titles: title,

        prop: "extracts|pageimages|info",

        exintro: "1",
        explaintext: "1",
        exsentences: "3",

        piprop: "thumbnail|original",
        pithumbsize: "800",

        inprop: "url",

        redirects: "1"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Wikipedia sayfası alınamadı: ${response.status}`
        );
    }

    const data = await response.json();
    const page = data.query?.pages?.[0];

    if (!page || page.missing) {
        return null;
    }

    return page;
}

/* ==========================
   CLEAN TEXT
========================== */

function cleanGuideText(text) {
    if (!text) {
        return "";
    }

    return text
        .replace(/\s+/g, " ")
        .replace(/\[[^\]]*]/g, "")
        .trim();
}

/* ==========================
   GET PAGE IMAGE
========================== */

function getPageImage(page) {
    return (
        page.thumbnail?.source ||
        page.original?.source ||
        ""
    );
}

/* ==========================
   CREATE GUIDE ITEM
========================== */

function createGuideItem(
    page,
    category,
    fallbackTitle = ""
) {
    const config = COUNTRY_GUIDE_CONFIG[category];

    const title =
        page?.title ||
        fallbackTitle ||
        config.label;

    const description =
        cleanGuideText(page?.extract) ||
        config.fallbackDescription;

    const image = getPageImage(page);

    const pageUrl =
        page?.fullurl ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(
            title.replaceAll(" ", "_")
        )}`;

    return {
        title,
        description,
        image,
        pageUrl
    };
}

/* ==========================
   CHECK RESULT
========================== */

function isUsableGuidePage(page) {
    if (!page || page.missing) {
        return false;
    }

    const title = page.title?.toLowerCase() || "";

    const blockedWords = [
        "list of",
        "outline of",
        "index of",
        "category:",
        "template:",
        "portal:"
    ];

    return !blockedWords.some(
        blockedWord => title.includes(blockedWord)
    );
}

/* ==========================
   REMOVE DUPLICATES
========================== */

function removeDuplicateGuideItems(items) {
    const usedTitles = new Set();

    return items.filter(item => {
        const normalizedTitle = item.title
            .toLocaleLowerCase("en-US")
            .trim();

        if (usedTitles.has(normalizedTitle)) {
            return false;
        }

        usedTitles.add(normalizedTitle);
        return true;
    });
}

/* ==========================
   LOAD CURATED CATEGORY
========================== */

async function loadCuratedCategory(
    country,
    category,
    titles
) {
    const settledPages = await Promise.allSettled(
        titles.map(title => getWikipediaPage(title))
    );

    const items = settledPages
        .map((result, index) => {
            if (
                result.status !== "fulfilled" ||
                !result.value
            ) {
                return null;
            }

            return createGuideItem(
                result.value,
                category,
                titles[index]
            );
        })
        .filter(Boolean);

    return removeDuplicateGuideItems(items).slice(0, 3);
}

/* ==========================
   LOAD AUTOMATIC CATEGORY
========================== */

async function loadAutomaticCategory(
    country,
    category
) {
    const config = COUNTRY_GUIDE_CONFIG[category];
    const countryName = getCountrySearchName(country);

    const collectedPages = [];

    for (const createQuery of config.queries) {
        const query = createQuery(countryName);

        try {
            const pages = await searchWikipedia(query, 8);

            pages.forEach(page => {
                if (isUsableGuidePage(page)) {
                    collectedPages.push(page);
                }
            });
        } catch (error) {
            console.warn(
                `Rehber araması başarısız: ${query}`,
                error
            );
        }

        if (collectedPages.length >= 6) {
            break;
        }
    }

    const usablePages = collectedPages
        .filter(page => getPageImage(page))
        .slice(0, 3);

    const backupPages = collectedPages
        .filter(
            page =>
                !usablePages.some(
                    item => item.pageid === page.pageid
                )
        )
        .slice(
            0,
            Math.max(0, 3 - usablePages.length)
        );

    const selectedPages = [
        ...usablePages,
        ...backupPages
    ].slice(0, 3);

    return removeDuplicateGuideItems(
        selectedPages.map(page =>
            createGuideItem(page, category)
        )
    );
}

/* ==========================
   LOAD COUNTRY GUIDE CATEGORY
========================== */

async function loadCountryGuideCategory(
    country,
    category
) {
    if (!COUNTRY_GUIDE_CONFIG[category]) {
        throw new Error(
            "Geçersiz ülke rehberi kategorisi."
        );
    }

    const curatedData =
        CURATED_COUNTRY_GUIDE[country.cca3]?.[category];

    if (curatedData?.length) {
        const curatedItems =
            await loadCuratedCategory(
                country,
                category,
                curatedData
            );

        if (curatedItems.length > 0) {
            return curatedItems;
        }
    }

    return loadAutomaticCategory(country, category);
}

/* ==========================
   LOAD COMPLETE COUNTRY GUIDE
========================== */

async function loadCompleteCountryGuide(country) {
    const categories = [
        "foods",
        "places",
        "activities"
    ];

    const results = await Promise.allSettled(
        categories.map(category =>
            loadCountryGuideCategory(
                country,
                category
            )
        )
    );

    return categories.reduce(
        (guideData, category, index) => {
            const result = results[index];

            guideData[category] =
                result.status === "fulfilled"
                    ? result.value
                    : [];

            return guideData;
        },
        {}
    );
}