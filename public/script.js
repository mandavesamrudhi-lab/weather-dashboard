const API_KEY = "YOUR_API_KEY";

async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        // your existing dashboard code
// temperature
// humidity
// wind speed
// etc.

loadTemperatureHistory(city);

        if (data.cod !== 200) {
            alert("City not found");
            return;
        }

        document.getElementById("cityName").textContent = data.name;
        document.getElementById("temperature").textContent =
            data.main.temp + "°C";
        document.getElementById("humidity").textContent =
            data.main.humidity + " %";
        document.getElementById("windSpeed").textContent =
            data.wind.speed + " m/s";

    } catch (error) {
        console.error(error);
        alert("Unable to get weather data");
    }
}
// ===============================
// 7-DAY TEMPERATURE HISTORY
// ===============================

let temperatureChart = null;

async function loadTemperatureHistory(city) {

    try {

        // Find the latitude and longitude of the city
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const locationData = await locationResponse.json();

        if (!locationData.results) {
            console.log("City not found");
            return;
        }

        const latitude = locationData.results[0].latitude;
        const longitude = locationData.results[0].longitude;
        const cityName = locationData.results[0].name;


        // Calculate the previous 7 days
        const today = new Date();

        const endDate = new Date(today);
        endDate.setDate(today.getDate() - 1);

        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);


        function formatDate(date) {
            return date.toISOString().split("T")[0];
        }

        const start = formatDate(startDate);
        const end = formatDate(endDate);


        // Get historical temperature
        const weatherResponse = await fetch(
            `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${start}&end_date=${end}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        const weatherData = await weatherResponse.json();


        if (!weatherData.daily) {
            console.log("Historical data unavailable");
            return;
        }


        const dates = weatherData.daily.time;

        const maxTemperatures =
            weatherData.daily.temperature_2m_max;

        const minTemperatures =
            weatherData.daily.temperature_2m_min;


        // Display city name
        const cityElement =
            document.getElementById("historyCity");

        if (cityElement) {
            cityElement.textContent =
                `${cityName} - Previous 7 Days`;
        }


        // Create graph
        createTemperatureChart(
            dates,
            maxTemperatures,
            minTemperatures
        );


    } catch (error) {

        console.error(
            "Temperature history error:",
            error
        );

    }
}


function createTemperatureChart(
    dates,
    maxTemperatures,
    minTemperatures
) {

    const canvas =
        document.getElementById("temperatureChart");


    if (!canvas) {
        console.log("Temperature chart not found");
        return;
    }


    // Remove old graph
    if (temperatureChart) {
        temperatureChart.destroy();
    }


    temperatureChart = new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels: dates,

                datasets: [

                    {
                        label: "Maximum Temperature (°C)",

                        data: maxTemperatures,

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false
                    },

                    {
                        label: "Minimum Temperature (°C)",

                        data: minTemperatures,

                        borderWidth: 3,

                        tension: 0.4,

                        fill: false
                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: true
                    }

                },

                scales: {

                    x: {

                        title: {
                            display: true,
                            text: "Date"
                        }

                    },

                    y: {

                        title: {
                            display: true,
                            text: "Temperature (°C)"
                        }

                    }

                }

            }

        }
    );
}