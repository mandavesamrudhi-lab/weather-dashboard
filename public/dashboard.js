/* =========================================================
   WEATHER DASHBOARD - FINAL STABLE VERSION
   =========================================================
   Features:
   1. City Search
   2. Current Weather
   3. Temperature History
   4. Leaflet Map
   5. Weather Details
   6. Air Quality
   7. 7-Day Forecast
   8. 24-Hour Forecast
   9. Favorite Cities
   10. Dark/Light Theme
   11. Weather Alerts
   12. AI Weather Assistant
   13. Toast Notifications
   14. Slide Navigation
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentSlide = 0;
let currentWeatherData = null;
let currentLocation = null;

let temperatureChart = null;
let weatherMap = null;
let weatherMarker = null;
let toastTimer = null;

let favoriteCities = [];

try {
    favoriteCities =
        JSON.parse(
            localStorage.getItem("favoriteCities")
        ) || [];
} catch (error) {
    favoriteCities = [];
}

let darkMode =
    localStorage.getItem("weatherDarkMode") === "true";


/* =========================================================
   API URLs
========================================================= */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";

const AIR_QUALITY_API =
    "https://air-quality-api.open-meteo.com/v1/air-quality";


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeTheme();
        initializeButtons();
        initializeSearch();
        initializeFavorites();
        initializeAI();
        initializeSlides();

        showSlide(0);

    }
);


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );

    updateThemeButton();

}


function toggleTheme() {

    darkMode =
        !document.body.classList.contains(
            "dark-mode"
        );

    document.body.classList.toggle(
        "dark-mode",
        darkMode
    );

    localStorage.setItem(
        "weatherDarkMode",
        String(darkMode)
    );

    updateThemeButton();

    showToast(
        "Theme Updated",
        darkMode
            ? "Dark mode enabled"
            : "Light mode enabled",
        darkMode ? "☀️" : "🌙"
    );

}


function updateThemeButton() {

    const button =
        document.getElementById(
            "themeToggle"
        );

    if (!button) return;

    button.innerHTML =
        document.body.classList.contains(
            "dark-mode"
        )
            ? "☀️"
            : "🌙";

    button.setAttribute(
        "aria-label",
        document.body.classList.contains(
            "dark-mode"
        )
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

}


/* =========================================================
   BUTTON INITIALIZATION
========================================================= */

function initializeButtons() {

    /* Theme */

    const themeButton =
        document.getElementById(
            "themeToggle"
        );

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );

    }


    /* Search Button */

    const searchButton =
        document.getElementById(
            "searchButton"
        );

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            searchWeather
        );

    }


    /* Favorites */

    const favoritesButton =
        document.getElementById(
            "favoritesToggle"
        );

    if (favoritesButton) {

        favoritesButton.addEventListener(
            "click",
            openFavorites
        );

    }


    const closeFavoritesButton =
        document.getElementById(
            "closeFavorites"
        );

    if (closeFavoritesButton) {

        closeFavoritesButton.addEventListener(
            "click",
            closeFavorites
        );

    }


    const favoriteButton =
        document.getElementById(
            "favoriteCityBtn"
        );

    if (favoriteButton) {

        favoriteButton.addEventListener(
            "click",
            toggleCurrentFavorite
        );

    }


    const currentFavoriteAction =
        document.getElementById(
            "favoriteCurrentAction"
        );

    if (currentFavoriteAction) {

        currentFavoriteAction.addEventListener(
            "click",
            toggleCurrentFavorite
        );

    }


    /* Toast */

    const closeToast =
        document.getElementById(
            "closeToast"
        );

    if (closeToast) {

        closeToast.addEventListener(
            "click",
            hideToast
        );

    }


    /* Previous Slide */

    const previousButton =
        document.getElementById(
            "previousBtn"
        );

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousSlide
        );

    }


    /* Next Slide */

    const nextButton =
        document.getElementById(
            "nextBtn"
        );

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextSlide
        );

    }


    /* Navigation Buttons */

    const navigationButtons =
        document.querySelectorAll(
            ".navigation .nav-btn"
        );

    navigationButtons.forEach(
        function (button, index) {

            button.addEventListener(
                "click",
                function () {

                    showSlide(index);

                }
            );

        }
    );


    /* Favorites Overlay */

    const overlay =
        document.getElementById(
            "favoritesOverlay"
        );

    if (overlay) {

        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === overlay
                ) {

                    closeFavorites();

                }

            }
        );

    }

}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {

    const input =
        document.getElementById(
            "cityInput"
        );

    if (!input) return;

    input.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchWeather();

            }

        }
    );

}


/* =========================================================
   SEARCH WEATHER
========================================================= */

async function searchWeather() {

    const input =
        document.getElementById(
            "cityInput"
        );

    if (!input) return;

    const city =
        input.value.trim();

    if (!city) {

        setSearchMessage(
            "Please enter a city name.",
            "error"
        );

        input.focus();

        return;

    }

    setSearchMessage(
        "🔍 Searching for " + city + "...",
        "loading"
    );

    try {

        const location =
            await getCityLocation(city);

        if (!location) {

            throw new Error(
                "City not found"
            );

        }

        currentLocation =
            normalizeLocation(location);

        const weather =
            await getWeatherData(
                currentLocation.latitude,
                currentLocation.longitude
            );

        currentWeatherData =
            weather;


        /* Update all dashboard sections */

        updateCurrentWeather(
            currentLocation,
            weather
        );

        updateWeatherDetails(
            weather
        );

        updateForecast(
            weather
        );

        updateHourlyForecast(
            weather
        );

        updateTemperatureHistory(
            weather
        );

        updateMap(
            currentLocation
        );

        await updateAirQuality(
            currentLocation.latitude,
            currentLocation.longitude
        );

        generateWeatherAlert(
            weather
        );

        updateAIAssistant(
            weather
        );

        updateFavoriteButton();

        updateFavoriteCurrentCity();


        /* Success */

        setSearchMessage(
            "✓ Weather loaded for " +
            currentLocation.name,
            "success"
        );

        showToast(
            "Weather Updated",
            "Live weather loaded for " +
            currentLocation.name,
            "🌤️"
        );

    } catch (error) {

        console.error(
            "Weather search error:",
            error
        );

        setSearchMessage(
            "Unable to load weather. Please try another city.",
            "error"
        );

        showToast(
            "Search Error",
            "Could not load weather data.",
            "⚠️"
        );

    }

}


/* =========================================================
   NORMALIZE LOCATION
========================================================= */

function normalizeLocation(location) {

    return {

        id:
            location.id ||
            (
                location.name +
                "_" +
                location.latitude +
                "_" +
                location.longitude
            ),

        name:
            location.name || "Unknown City",

        country:
            location.country || "",

        admin1:
            location.admin1 || "",

        latitude:
            Number(location.latitude),

        longitude:
            Number(location.longitude)

    };

}


/* =========================================================
   GEOCODING
========================================================= */

async function getCityLocation(city) {

    const url =
        GEOCODING_API +
        "?name=" +
        encodeURIComponent(city) +
        "&count=1" +
        "&language=en" +
        "&format=json";

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Geocoding request failed"
        );

    }

    const data =
        await response.json();

    if (
        !data.results ||
        data.results.length === 0
    ) {

        return null;

    }

    return data.results[0];

}


/* =========================================================
   WEATHER API
========================================================= */

async function getWeatherData(
    latitude,
    longitude
) {

    const params =
        new URLSearchParams({

            latitude,
            longitude,

            current:
                "temperature_2m," +
                "relative_humidity_2m," +
                "apparent_temperature," +
                "is_day," +
                "precipitation," +
                "rain," +
                "weather_code," +
                "cloud_cover," +
                "pressure_msl," +
                "wind_speed_10m," +
                "visibility",

            hourly:
                "temperature_2m," +
                "relative_humidity_2m," +
                "precipitation_probability," +
                "weather_code," +
                "wind_speed_10m",

            daily:
                "weather_code," +
                "temperature_2m_max," +
                "temperature_2m_min," +
                "sunrise," +
                "sunset," +
                "uv_index_max",

            timezone:
                "auto",

            past_days:
                "7",

            forecast_days:
                "7"

        });

    const response =
        await fetch(
            WEATHER_API +
            "?" +
            params.toString()
        );

    if (!response.ok) {

        throw new Error(
            "Weather API request failed"
        );

    }

    const data =
        await response.json();

    if (
        !data.current ||
        !data.daily ||
        !data.hourly
    ) {

        throw new Error(
            "Invalid weather data received"
        );

    }

    return data;

}


/* =========================================================
   CURRENT WEATHER
========================================================= */

function updateCurrentWeather(
    location,
    weather
) {

    const current =
        weather.current;

    setText(
        "cityName",
        location.name
    );

    setText(
        "countryName",
        buildLocationName(location)
    );

    setText(
        "temperature",
        formatNumber(
            current.temperature_2m
        )
    );

    setText(
        "feelsLike",
        formatNumber(
            current.apparent_temperature
        )
    );

    setText(
        "humidity",
        formatNumber(
            current.relative_humidity_2m
        )
    );

    setText(
        "windSpeed",
        formatNumber(
            current.wind_speed_10m
        )
    );

    setText(
        "pressure",
        formatNumber(
            current.pressure_msl
        )
    );

    const description =
        getWeatherDescription(
            current.weather_code
        );

    setText(
        "weatherDescription",
        description.text
    );

    setText(
        "weatherConditionCard",
        description.text
    );

    setText(
        "weatherIcon",
        getWeatherIcon(
            current.weather_code,
            current.is_day
        )
    );

    updateWeatherBackground(
        current.weather_code
    );

}


/* =========================================================
   LOCATION NAME
========================================================= */

function buildLocationName(location) {

    const parts = [];

    if (location.admin1) {

        parts.push(
            location.admin1
        );

    }

    if (location.country) {

        parts.push(
            location.country
        );

    }

    return parts.join(", ");

}


/* =========================================================
   WEATHER DETAILS
========================================================= */

function updateWeatherDetails(weather) {

    const current =
        weather.current;

    const daily =
        weather.daily;

    setText(
        "sunrise",
        formatTime(
            daily.sunrise?.[0]
        )
    );

    setText(
        "sunset",
        formatTime(
            daily.sunset?.[0]
        )
    );

    setText(
        "minTemp",
        formatNumber(
            daily.temperature_2m_min?.[0]
        )
    );

    setText(
        "maxTemp",
        formatNumber(
            daily.temperature_2m_max?.[0]
        )
    );

    setText(
        "cloudCover",
        formatNumber(
            current.cloud_cover
        )
    );

    setText(
        "visibility",
        formatVisibility(
            current.visibility
        )
    );

}


/* =========================================================
   7 DAY FORECAST
========================================================= */

function updateForecast(weather) {

    const container =
        document.getElementById(
            "forecastContainer"
        );

    if (!container) return;

    const daily =
        weather.daily;

    container.innerHTML = "";

    const totalDays =
        Math.min(
            7,
            daily.time.length
        );

    for (
        let i = 0;
        i < totalDays;
        i++
    ) {

        const date =
            new Date(
                daily.time[i] +
                "T12:00:00"
            );

        const description =
            getWeatherDescription(
                daily.weather_code[i]
            );

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "forecast-card";

        card.innerHTML = `

            <div class="forecast-day">
                ${
                    i === 0
                        ? "Today"
                        : formatDay(date)
                }
            </div>

            <div class="forecast-icon">
                ${description.icon}
            </div>

            <div class="forecast-condition">
                ${escapeHTML(
                    description.text
                )}
            </div>

            <div class="forecast-temperature">
                ${formatNumber(
                    daily.temperature_2m_max[i]
                )}°C
            </div>

            <div class="forecast-min">
                Low:
                ${formatNumber(
                    daily.temperature_2m_min[i]
                )}°C
            </div>

        `;

        container.appendChild(
            card
        );

    }

}


/* =========================================================
   24 HOUR FORECAST
========================================================= */

function updateHourlyForecast(weather) {

    const container =
        document.getElementById(
            "hourlyForecastContainer"
        );

    if (!container) return;

    const hourly =
        weather.hourly;

    container.innerHTML = "";

    const currentTime =
        weather.current?.time ||
        hourly.time[0];

    let startIndex = 0;

    for (
        let i = 0;
        i < hourly.time.length;
        i++
    ) {

        if (
            hourly.time[i] >=
            currentTime
        ) {

            startIndex = i;

            break;

        }

    }

    for (
        let offset = 0;
        offset < 24;
        offset++
    ) {

        const index =
            startIndex + offset;

        if (
            index >=
            hourly.time.length
        ) {

            break;

        }

        const date =
            new Date(
                hourly.time[index]
            );

        const description =
            getWeatherDescription(
                hourly.weather_code[index]
            );

        const temperature =
            hourly.temperature_2m[index];

        const rainChance =
            hourly.precipitation_probability[
                index
            ];

        const wind =
            hourly.wind_speed_10m[
                index
            ];

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "hourly-card";

        card.innerHTML = `

            <div class="hourly-time">
                ${formatHour(date)}
            </div>

            <div class="hourly-icon">
                ${description.icon}
            </div>

            <div class="hourly-temperature">
                ${formatNumber(
                    temperature
                )}°C
            </div>

            <div class="hourly-condition">
                ${escapeHTML(
                    description.text
                )}
            </div>

            <div class="hourly-rain">
                🌧️ ${rainChance ?? 0}%
            </div>

            <div class="hourly-wind">
                💨 ${formatNumber(wind)}
                km/h
            </div>

        `;

        container.appendChild(
            card
        );

    }

}


/* =========================================================
   TEMPERATURE HISTORY
========================================================= */

function updateTemperatureHistory(weather) {

    const daily =
        weather.daily;

    if (
        !daily ||
        !daily.time ||
        daily.time.length === 0
    ) {

        return;

    }

    const start =
        Math.max(
            0,
            daily.time.length - 8
        );

    const labels = [];
    const temperatures = [];
    const historyItems = [];

    for (
        let i = start;
        i < daily.time.length;
        i++
    ) {

        const date =
            new Date(
                daily.time[i] +
                "T12:00:00"
            );

        const max =
            Number(
                daily.temperature_2m_max[i]
            );

        const min =
            Number(
                daily.temperature_2m_min[i]
            );

        const average =
            Number(
                (
                    (max + min) / 2
                ).toFixed(1)
            );

        labels.push(
            formatShortDay(date)
        );

        temperatures.push(
            average
        );

        historyItems.push({

            date:
                formatFullDate(date),

            temperature:
                average

        });

    }

    updateHistoryList(
        historyItems
    );

    createTemperatureChart(
        labels,
        temperatures
    );

}


/* =========================================================
   HISTORY LIST
========================================================= */

function updateHistoryList(items) {

    const container =
        document.getElementById(
            "historyList"
        );

    if (!container) return;

    container.innerHTML = "";

    items.forEach(
        function (item) {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "history-item";

            element.innerHTML = `

                <span>
                    ${escapeHTML(item.date)}
                </span>

                <strong>
                    ${item.temperature}°C
                </strong>

            `;

            container.appendChild(
                element
            );

        }
    );

}


/* =========================================================
   CHART
========================================================= */

function createTemperatureChart(
    labels,
    temperatures
) {

    const canvas =
        document.getElementById(
            "temperatureChart"
        );

    if (!canvas) return;

    if (
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;

    }

    if (temperatureChart) {

        temperatureChart.destroy();

        temperatureChart =
            null;

    }

    const dark =
        document.body.classList.contains(
            "dark-mode"
        );

    const textColor =
        dark
            ? "#e5e7eb"
            : "#475569";

    const gridColor =
        dark
            ? "rgba(255,255,255,0.08)"
            : "rgba(15,23,42,0.08)";

    temperatureChart =
        new Chart(
            canvas.getContext("2d"),
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Average Temperature (°C)",

                            data:
                                temperatures,

                            borderColor:
                                "#2563eb",

                            backgroundColor:
                                "rgba(37,99,235,0.12)",

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true,

                            pointRadius: 5,

                            pointHoverRadius: 7

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {

                        intersect: false,

                        mode: "index"

                    },

                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    textColor

                            }

                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    textColor

                            },

                            grid: {

                                color:
                                    gridColor

                            }

                        },

                        y: {

                            ticks: {

                                color:
                                    textColor,

                                callback:
                                    function (value) {

                                        return (
                                            value +
                                            "°C"
                                        );

                                    }

                            },

                            grid: {

                                color:
                                    gridColor

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   MAP
========================================================= */

function updateMap(location) {

    if (
        typeof L === "undefined"
    ) {

        console.warn(
            "Leaflet is not loaded."
        );

        return;

    }

    const mapElement =
        document.getElementById(
            "weatherMap"
        );

    if (!mapElement) return;

    const latitude =
        Number(location.latitude);

    const longitude =
        Number(location.longitude);

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {

        return;

    }


    /* Create map */

    if (!weatherMap) {

        weatherMap =
            L.map(
                mapElement
            ).setView(
                [
                    latitude,
                    longitude
                ],
                10
            );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {

                maxZoom: 19,

                attribution:
                    "&copy; OpenStreetMap contributors"

            }
        ).addTo(
            weatherMap
        );

    } else {

        weatherMap.setView(
            [
                latitude,
                longitude
            ],
            10
        );

    }


    /* Remove old marker */

    if (weatherMarker) {

        weatherMarker.remove();

    }


    /* Add new marker */

    weatherMarker =
        L.marker(
            [
                latitude,
                longitude
            ]
        )
        .addTo(
            weatherMap
        )
        .bindPopup(
            `
                <strong>
                    ${escapeHTML(
                        location.name
                    )}
                </strong>
                <br>
                ${escapeHTML(
                    location.country
                )}
            `
        )
        .openPopup();


    /* Fix hidden-map rendering */

    setTimeout(
        function () {

            if (weatherMap) {

                weatherMap.invalidateSize();

            }

        },
        300
    );

}


/* =========================================================
   AIR QUALITY
========================================================= */

async function updateAirQuality(
    latitude,
    longitude
) {

    try {

        const params =
            new URLSearchParams({

                latitude,

                longitude,

                current:
                    "european_aqi," +
                    "pm2_5," +
                    "pm10," +
                    "ozone," +
                    "nitrogen_dioxide," +
                    "uv_index"

            });

        const response =
            await fetch(
                AIR_QUALITY_API +
                "?" +
                params.toString()
            );

        if (!response.ok) {

            throw new Error(
                "Air quality request failed"
            );

        }

        const data =
            await response.json();

        const current =
            data.current || {};

        setText(
            "aqi",
            formatNumber(
                current.european_aqi
            )
        );

        setText(
            "pm25",
            formatNumber(
                current.pm2_5
            )
        );

        setText(
            "pm10",
            formatNumber(
                current.pm10
            )
        );

        setText(
            "ozone",
            formatNumber(
                current.ozone
            )
        );

        setText(
            "nitrogenDioxide",
            formatNumber(
                current.nitrogen_dioxide
            )
        );

        setText(
            "uvIndex",
            formatNumber(
                current.uv_index
            )
        );

    } catch (error) {

        console.error(
            "Air quality error:",
            error
        );

        [
            "aqi",
            "pm25",
            "pm10",
            "ozone",
            "nitrogenDioxide",
            "uvIndex"
        ].forEach(
            function (id) {

                setText(
                    id,
                    "--"
                );

            }
        );

    }

}


/* =========================================================
   WEATHER ALERT
========================================================= */

function generateWeatherAlert(weather) {

    const alert =
        document.getElementById(
            "weatherAlert"
        );

    const title =
        document.getElementById(
            "alertTitle"
        );

    const message =
        document.getElementById(
            "alertMessage"
        );

    if (
        !alert ||
        !title ||
        !message
    ) {

        return;

    }

    const current =
        weather.current;

    const temperature =
        Number(
            current.temperature_2m
        );

    const wind =
        Number(
            current.wind_speed_10m
        );

    const rain =
        Number(
            current.precipitation || 0
        );

    const code =
        Number(
            current.weather_code
        );


    alert.style.display =
        "flex";

    alert.className =
        "weather-alert normal";


    /* Thunderstorm FIRST */

    if (
        code >= 95
    ) {

        alert.classList.add(
            "danger"
        );

        title.textContent =
            "Thunderstorm Alert";

        message.textContent =
            "Thunderstorm conditions are possible. Avoid unnecessary outdoor activities.";

        return;

    }


    /* Extreme heat */

    if (
        temperature >= 40
    ) {

        alert.classList.add(
            "danger"
        );

        title.textContent =
            "Extreme Heat Alert";

        message.textContent =
            "Temperature is extremely high. Stay hydrated and avoid unnecessary outdoor activity.";

        return;

    }


    /* High heat */

    if (
        temperature >= 35
    ) {

        alert.classList.add(
            "warning"
        );

        title.textContent =
            "High Temperature";

        message.textContent =
            "It is quite hot today. Drink plenty of water and limit direct sun exposure.";

        return;

    }


    /* Strong wind */

    if (
        wind >= 45
    ) {

        alert.classList.add(
            "danger"
        );

        title.textContent =
            "Strong Wind Alert";

        message.textContent =
            "Strong winds are currently expected. Take care when travelling outdoors.";

        return;

    }


    /* Rain */

    if (
        rain > 0 ||
        isRainWeather(code)
    ) {

        alert.classList.add(
            "info"
        );

        title.textContent =
            "Rain Alert";

        message.textContent =
            "Rainy conditions are possible. Carry an umbrella if you are going outside.";

        return;

    }


    /* Normal */

    alert.classList.add(
        "normal"
    );

    title.textContent =
        "Weather Looks Good";

    message.textContent =
        "No major weather alert detected for the current conditions.";

}


/* =========================================================
   AI
========================================================= */

function initializeAI() {

    const button =
        document.getElementById(
            "aiAskButton"
        );

    const input =
        document.getElementById(
            "aiQuestion"
        );

    if (button) {

        button.addEventListener(
            "click",
            askAI
        );

    }

    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    askAI();

                }

            }
        );

    }


    /* Quick questions */

    document
        .querySelectorAll(
            "[data-ai-question]"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        askQuickQuestion(
                            button.dataset.aiQuestion
                        );

                    }
                );

            }
        );

}


function updateAIAssistant(
    weather
) {

    const current =
        weather.current;

    setText(
        "aiTemperature",
        formatNumber(
            current.temperature_2m
        ) + " °C"
    );

    setText(
        "aiHumidity",
        formatNumber(
            current.relative_humidity_2m
        ) + " %"
    );

    setText(
        "aiRainChance",
        getCurrentRainChance(
            weather
        ) + " %"
    );

    setText(
        "aiWind",
        formatNumber(
            current.wind_speed_10m
        ) + " km/h"
    );

}


function getCurrentRainChance(
    weather
) {

    if (
        !weather.hourly ||
        !weather.hourly.time ||
        !weather.hourly.precipitation_probability
    ) {

        return 0;

    }

    const currentTime =
        weather.current?.time ||
        weather.hourly.time[0];

    for (
        let i = 0;
        i < weather.hourly.time.length;
        i++
    ) {

        if (
            weather.hourly.time[i] >=
            currentTime
        ) {

            return Number(
                weather.hourly
                    .precipitation_probability[i] ||
                0
            );

        }

    }

    return 0;

}


function askAI() {

    const input =
        document.getElementById(
            "aiQuestion"
        );

    if (!input) return;

    const question =
        input.value.trim();

    if (!question) {

        showToast(
            "Ask a Question",
            "Please enter a weather question.",
            "🤖"
        );

        return;

    }

    if (!currentWeatherData) {

        displayAIAnswer(
            "Weather Assistant",
            "Please search for a city first."
        );

        return;

    }

    const response =
        generateAIResponse(
            question,
            currentWeatherData
        );

    displayAIAnswer(
        "Weather Assistant",
        response
    );

}


function askQuickQuestion(
    question
) {

    const input =
        document.getElementById(
            "aiQuestion"
        );

    if (input) {

        input.value =
            question;

    }

    askAI();

}


function generateAIResponse(
    question,
    weather
) {

    const current =
        weather.current;

    const temperature =
        Number(
            current.temperature_2m
        );

    const humidity =
        Number(
            current.relative_humidity_2m
        );

    const wind =
        Number(
            current.wind_speed_10m
        );

    const code =
        Number(
            current.weather_code
        );

    const rain =
        getCurrentRainChance(
            weather
        );

    const text =
        question.toLowerCase();


    /* Travel */

    if (
        text.includes("travel") ||
        text.includes("trip")
    ) {

        if (
            rain >= 60 ||
            isRainWeather(code)
        ) {

            return "Travel is possible, but rainy conditions may affect your journey. Carry an umbrella and allow extra travel time.";

        }

        if (
            temperature >= 38
        ) {

            return "You can travel, but the weather is very hot. Carry water and use sun protection.";

        }

        return "The current conditions look reasonably comfortable for travel. Check the forecast before leaving.";

    }


    /* Rain */

    if (
        text.includes("umbrella") ||
        text.includes("rain")
    ) {

        if (
            rain >= 50 ||
            isRainWeather(code)
        ) {

            return "Yes, carrying an umbrella is recommended because rain is possible.";

        }

        return "An umbrella is probably not necessary right now.";

    }


    /* Clothing */

    if (
        text.includes("wear") ||
        text.includes("clothes") ||
        text.includes("dress")
    ) {

        if (
            temperature >= 35
        ) {

            return "Wear light, breathable clothing and use sun protection.";

        }

        if (
            temperature <= 18
        ) {

            return "The weather is cool. Consider wearing a light jacket.";

        }

        return "Comfortable light clothing should work well.";

    }


    /* Outdoor */

    if (
        text.includes("outdoor") ||
        text.includes("activity") ||
        text.includes("exercise")
    ) {

        if (
            rain >= 50 ||
            isRainWeather(code)
        ) {

            return "Outdoor activities may be affected by rain. Consider an indoor activity.";

        }

        if (
            temperature >= 38
        ) {

            return "Outdoor activity is possible, but avoid intense exercise during the hottest part of the day.";

        }

        return "Current conditions look suitable for normal outdoor activities.";

    }


    /* Temperature */

    if (
        text.includes("temperature") ||
        text.includes("hot") ||
        text.includes("cold")
    ) {

        return (
            "Current temperature is " +
            temperature +
            "°C. Humidity is " +
            humidity +
            "% and wind speed is " +
            wind +
            " km/h."
        );

    }


    return (
        "Currently it is " +
        temperature +
        "°C with " +
        getWeatherDescription(code).text +
        ". Humidity is " +
        humidity +
        "% and wind speed is " +
        wind +
        " km/h."
    );

}


function displayAIAnswer(
    title,
    message
) {

    const answer =
        document.getElementById(
            "aiAnswer"
        );

    if (!answer) return;

    answer.innerHTML = `

        <div class="ai-answer-icon">
            🤖
        </div>

        <div class="ai-answer-content">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


/* =========================================================
   FAVORITES
========================================================= */

function initializeFavorites() {

    renderFavorites();

}


function openFavorites() {

    const panel =
        document.getElementById(
            "favoritesPanel"
        );

    const overlay =
        document.getElementById(
            "favoritesOverlay"
        );

    if (panel) {

        panel.classList.add(
            "open"
        );

    }

    if (overlay) {

        overlay.classList.add(
            "show"
        );

    }

    renderFavorites();

}


function closeFavorites() {

    const panel =
        document.getElementById(
            "favoritesPanel"
        );

    const overlay =
        document.getElementById(
            "favoritesOverlay"
        );

    if (panel) {

        panel.classList.remove(
            "open"
        );

    }

    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }

}


function toggleCurrentFavorite() {

    if (!currentLocation) {

        showToast(
            "No City Selected",
            "Search for a city first.",
            "⭐"
        );

        return;

    }

    const cityId =
        currentLocation.id;


    const index =
        favoriteCities.findIndex(
            function (city) {

                return (
                    String(city.id) ===
                    String(cityId)
                );

            }
        );


    if (index === -1) {

        favoriteCities.push({

            id:
                cityId,

            name:
                currentLocation.name,

            country:
                currentLocation.country,

            latitude:
                currentLocation.latitude,

            longitude:
                currentLocation.longitude

        });

        showToast(
            "Added to Favorites",
            currentLocation.name +
            " has been saved.",
            "⭐"
        );

    } else {

        favoriteCities.splice(
            index,
            1
        );

        showToast(
            "Removed from Favorites",
            currentLocation.name +
            " has been removed.",
            "☆"
        );

    }

    saveFavorites();

    updateFavoriteButton();

    updateFavoriteCurrentCity();

    renderFavorites();

}


function updateFavoriteButton() {

    const button =
        document.getElementById(
            "favoriteCityBtn"
        );

    if (
        !button ||
        !currentLocation
    ) {

        return;

    }

    const isFavorite =
        favoriteCities.some(
            function (city) {

                return (
                    String(city.id) ===
                    String(currentLocation.id)
                );

            }
        );

    button.textContent =
        isFavorite
            ? "★"
            : "☆";

    button.classList.toggle(
        "is-favorite",
        isFavorite
    );

}


function saveFavorites() {

    try {

        localStorage.setItem(
            "favoriteCities",
            JSON.stringify(
                favoriteCities
            )
        );

    } catch (error) {

        console.error(
            "Could not save favorites",
            error
        );

    }

}


function renderFavorites() {

    const list =
        document.getElementById(
            "favoritesList"
        );

    if (!list) return;

    list.innerHTML = "";


    if (
        favoriteCities.length === 0
    ) {

        list.innerHTML = `

            <div class="no-favorites">

                <div class="no-favorites-icon">
                    ⭐
                </div>

                <h3>
                    No favorite cities
                </h3>

                <p>
                    Search for a city and save it here.
                </p>

            </div>

        `;

        updateFavoriteCurrentCity();

        return;

    }


    favoriteCities.forEach(
        function (city, index) {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "favorite-item";

            item.innerHTML = `

                <button
                    type="button"
                    class="favorite-city-info"
                    data-index="${index}"
                >

                    <strong>
                        ${escapeHTML(
                            city.name
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            city.country || ""
                        )}
                    </span>

                </button>

                <button
                    type="button"
                    class="remove-favorite-btn"
                    data-remove="${index}"
                    aria-label="Remove favorite"
                >
                    🗑️
                </button>

            `;

            list.appendChild(
                item
            );

        }
    );


    list
        .querySelectorAll(
            ".favorite-city-info"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        loadFavoriteCity(
                            Number(
                                button.dataset.index
                            )
                        );

                    }
                );

            }
        );


    list
        .querySelectorAll(
            ".remove-favorite-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        removeFavorite(
                            Number(
                                button.dataset.remove
                            )
                        );

                    }
                );

            }
        );


    updateFavoriteCurrentCity();

}


function updateFavoriteCurrentCity() {

    const nameElement =
        document.getElementById(
            "favoriteCurrentName"
        );

    const button =
        document.getElementById(
            "favoriteCurrentAction"
        );

    if (!nameElement) return;


    if (currentLocation) {

        nameElement.textContent =
            currentLocation.name;

        const saved =
            favoriteCities.some(
                function (city) {

                    return (
                        String(city.id) ===
                        String(
                            currentLocation.id
                        )
                    );

                }
            );

        if (button) {

            button.textContent =
                saved
                    ? "★ Saved"
                    : "☆ Save";

        }

    } else {

        nameElement.textContent =
            "No city selected";

        if (button) {

            button.textContent =
                "☆ Save";

        }

    }

}


function removeFavorite(index) {

    if (
        index < 0 ||
        index >= favoriteCities.length
    ) {

        return;

    }

    const city =
        favoriteCities[index];

    favoriteCities.splice(
        index,
        1
    );

    saveFavorites();

    renderFavorites();

    updateFavoriteButton();

    showToast(
        "Favorite Removed",
        city.name +
        " was removed.",
        "🗑️"
    );

}


async function loadFavoriteCity(index) {

    if (
        index < 0 ||
        index >= favoriteCities.length
    ) {

        return;

    }

    const city =
        favoriteCities[index];

    const input =
        document.getElementById(
            "cityInput"
        );

    if (input) {

        input.value =
            city.name;

    }

    closeFavorites();

    await searchWeather();

}


/* =========================================================
   SLIDES
========================================================= */

function initializeSlides() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    if (
        slides.length === 0
    ) {

        console.warn(
            "No .slide elements found."
        );

        return;

    }

    currentSlide = 0;

    slides.forEach(
        function (slide, index) {

            slide.classList.toggle(
                "active-slide",
                index === 0
            );

        }
    );

    updateNavigation();

    updateSlideControls();

}


function showSlide(index) {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    if (
        slides.length === 0
    ) {

        return;

    }

    index =
        Math.max(
            0,
            Math.min(
                index,
                slides.length - 1
            )
        );

    currentSlide =
        index;


    slides.forEach(
        function (slide, i) {

            slide.classList.toggle(
                "active-slide",
                i === currentSlide
            );

        }
    );


    updateNavigation();

    updateSlideControls();


    /* Fix map when its slide becomes visible */

    if (weatherMap) {

        setTimeout(
            function () {

                weatherMap.invalidateSize();

            },
            250
        );

    }


    /* Resize chart */

    if (temperatureChart) {

        setTimeout(
            function () {

                temperatureChart.resize();

            },
            250
        );

    }

}


function nextSlide() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    if (
        currentSlide <
        slides.length - 1
    ) {

        showSlide(
            currentSlide + 1
        );

    }

}


function previousSlide() {

    if (
        currentSlide > 0
    ) {

        showSlide(
            currentSlide - 1
        );

    }

}


function updateSlideControls() {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const previous =
        document.getElementById(
            "previousBtn"
        );

    const next =
        document.getElementById(
            "nextBtn"
        );

    const indicator =
        document.getElementById(
            "slideIndicator"
        );


    if (previous) {

        previous.disabled =
            currentSlide === 0;

    }


    if (next) {

        next.disabled =
            currentSlide >=
            slides.length - 1;

    }


    if (indicator) {

        indicator.textContent =
            `${currentSlide + 1} / ${slides.length}`;

    }

}


function updateNavigation() {

    const buttons =
        document.querySelectorAll(
            ".navigation .nav-btn"
        );

    buttons.forEach(
        function (button, index) {

            button.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );

}


/* =========================================================
   TOUCH / KEYBOARD SLIDES
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const tag =
            document.activeElement
                ?.tagName;

        if (
            tag === "INPUT" ||
            tag === "TEXTAREA"
        ) {

            return;

        }

        if (
            event.key === "ArrowRight"
        ) {

            nextSlide();

        }

        if (
            event.key === "ArrowLeft"
        ) {

            previousSlide();

        }

    }
);


let touchStartX = 0;

document.addEventListener(
    "touchstart",
    function (event) {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


document.addEventListener(
    "touchend",
    function (event) {

        const touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchStartX -
            touchEndX;

        if (
            Math.abs(difference) < 60
        ) {

            return;

        }

        if (difference > 0) {

            nextSlide();

        } else {

            previousSlide();

        }

    },
    { passive: true }
);


/* =========================================================
   WEATHER BACKGROUND
========================================================= */

function updateWeatherBackground(
    code
) {

    const body =
        document.body;

    body.classList.remove(
        "weather-clear",
        "weather-cloudy",
        "weather-rain",
        "weather-storm",
        "weather-snow",
        "weather-fog"
    );


    if (
        code === 0 ||
        code === 1
    ) {

        body.classList.add(
            "weather-clear"
        );

    } else if (
        code === 2 ||
        code === 3
    ) {

        body.classList.add(
            "weather-cloudy"
        );

    } else if (
        code >= 95
    ) {

        body.classList.add(
            "weather-storm"
        );

    } else if (
        code === 71 ||
        code === 73 ||
        code === 75 ||
        code === 77 ||
        code === 85 ||
        code === 86
    ) {

        body.classList.add(
            "weather-snow"
        );

    } else if (
        code === 45 ||
        code === 48
    ) {

        body.classList.add(
            "weather-fog"
        );

    } else if (
        isRainWeather(code)
    ) {

        body.classList.add(
            "weather-rain"
        );

    }

}


/* =========================================================
   WEATHER DESCRIPTION
========================================================= */

function getWeatherDescription(
    code
) {

    const weather = {

        0: {
            text: "Clear Sky",
            icon: "☀️"
        },

        1: {
            text: "Mainly Clear",
            icon: "🌤️"
        },

        2: {
            text: "Partly Cloudy",
            icon: "⛅"
        },

        3: {
            text: "Overcast",
            icon: "☁️"
        },

        45: {
            text: "Fog",
            icon: "🌫️"
        },

        48: {
            text: "Rime Fog",
            icon: "🌫️"
        },

        51: {
            text: "Light Drizzle",
            icon: "🌦️"
        },

        53: {
            text: "Drizzle",
            icon: "🌦️"
        },

        55: {
            text: "Heavy Drizzle",
            icon: "🌧️"
        },

        61: {
            text: "Light Rain",
            icon: "🌦️"
        },

        63: {
            text: "Moderate Rain",
            icon: "🌧️"
        },

        65: {
            text: "Heavy Rain",
            icon: "🌧️"
        },

        71: {
            text: "Light Snow",
            icon: "🌨️"
        },

        73: {
            text: "Moderate Snow",
            icon: "❄️"
        },

        75: {
            text: "Heavy Snow",
            icon: "❄️"
        },

        77: {
            text: "Snow Grains",
            icon: "❄️"
        },

        80: {
            text: "Light Showers",
            icon: "🌦️"
        },

        81: {
            text: "Moderate Showers",
            icon: "🌧️"
        },

        82: {
            text: "Heavy Showers",
            icon: "⛈️"
        },

        85: {
            text: "Snow Showers",
            icon: "🌨️"
        },

        86: {
            text: "Heavy Snow Showers",
            icon: "❄️"
        },

        95: {
            text: "Thunderstorm",
            icon: "⛈️"
        },

        96: {
            text: "Thunderstorm with Hail",
            icon: "⛈️"
        },

        99: {
            text: "Severe Thunderstorm",
            icon: "⛈️"
        }

    };

    return (
        weather[code] || {
            text: "Unknown Weather",
            icon: "🌤️"
        }
    );

}


/* =========================================================
   WEATHER ICON
========================================================= */

function getWeatherIcon(
    code,
    isDay
) {

    if (
        !isDay &&
        (
            code === 0 ||
            code === 1
        )
    ) {

        return "🌙";

    }

    return getWeatherDescription(
        code
    ).icon;

}


/* =========================================================
   RAIN CHECK
========================================================= */

function isRainWeather(
    code
) {

    return (

        (
            code >= 51 &&
            code <= 67
        ) ||

        (
            code >= 80 &&
            code <= 82
        )

    );

}


/* =========================================================
   SEARCH MESSAGE
========================================================= */

function setSearchMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "searchMessage"
        );

    if (!element) return;

    element.textContent =
        message;

    element.classList.remove(
        "success",
        "error",
        "loading"
    );

    if (type) {

        element.classList.add(
            type
        );

    }

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message,
    icon
) {

    const toast =
        document.getElementById(
            "weatherToast"
        );

    if (!toast) return;

    const titleElement =
        document.getElementById(
            "toastTitle"
        );

    const messageElement =
        document.getElementById(
            "toastMessage"
        );

    const iconElement =
        toast.querySelector(
            ".toast-icon"
        );


    if (titleElement) {

        titleElement.textContent =
            title;

    }

    if (messageElement) {

        messageElement.textContent =
            message;

    }

    if (iconElement) {

        iconElement.textContent =
            icon || "🌤️";

    }


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            hideToast,
            4500
        );

}


function hideToast() {

    const toast =
        document.getElementById(
            "weatherToast"
        );

    if (toast) {

        toast.classList.remove(
            "show"
        );

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    try {

        localStorage.removeItem(
            "weatherSession"
        );

    } catch (error) {

        console.warn(
            "Unable to clear session.",
            error
        );

    }

    window.location.href =
        "index.html";

}


/* =========================================================
   HELPER - SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) return;

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        element.textContent =
            "--";

        return;

    }

    element.textContent =
        value;

}


/* =========================================================
   HELPER - NUMBER
========================================================= */

function formatNumber(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === "" ||
        Number.isNaN(
            Number(value)
        )
    ) {

        return "--";

    }

    const number =
        Number(value);

    if (
        Number.isInteger(number)
    ) {

        return String(number);

    }

    return number.toFixed(1);

}


/* =========================================================
   HELPER - VISIBILITY
========================================================= */

function formatVisibility(
    meters
) {

    if (
        meters === undefined ||
        meters === null ||
        Number.isNaN(
            Number(meters)
        )
    ) {

        return "-- km";

    }

    return (
        Number(meters) /
        1000
    ).toFixed(1) + " km";

}


/* =========================================================
   HELPER - TIME
========================================================= */

function formatTime(
    value
) {

    if (!value) {

        return "--";

    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "--";

    }

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   HELPER - HOUR
========================================================= */

function formatHour(
    date
) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   HELPER - DAY
========================================================= */

function formatDay(
    date
) {

    return date.toLocaleDateString(
        [],
        {
            weekday: "short"
        }
    );

}


/* =========================================================
   HELPER - SHORT DAY
========================================================= */

function formatShortDay(
    date
) {

    return date.toLocaleDateString(
        [],
        {
            weekday: "short"
        }
    );

}


/* =========================================================
   HELPER - FULL DATE
========================================================= */

function formatFullDate(
    date
) {

    return date.toLocaleDateString(
        [],
        {
            weekday: "short",
            day: "numeric",
            month: "short"
        }
    );

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
// ===============================
// LOGOUT FUNCTION
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {

            // Remove login information
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("username");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("username");

            // Go back to login page
            window.location.href = "index.html";
        });
    }
});