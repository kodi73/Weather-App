const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const toggleUnitBtn = document.querySelector("#toggle-unit");
const gifContainer = document.querySelector("#gif");
const bodyContainer = document.querySelector("body");

const cityNameEl = document.querySelector("#city-name");
const temperatureEl = document.querySelector("#temperature");
const descriptionEl = document.querySelector("#description");
const errorEl = document.querySelector("#error");

const WEATHER_API_KEY = "";
const GIPHY_API_KEY = ""

let currentWeatherData = null;
let isCelsius = true;

async function getWeatherData(city) {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${WEATHER_API_KEY}&contentType=json`);

        if (!response.ok) {
            throw new Error("City not found.");
        }

        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log("Weather fetch error: ", error.message);
        showError(error.message);
        return null;
    }
}

function displayWeather(data) {
    const tempC = data.currentConditions.temp;
    const temp = isCelsius ? tempC : (tempC * 9) / 5 + 32;
    cityNameEl.textContent = data.resolvedAddress;
    temperatureEl.textContent = `Temperature: ${temp.toFixed(1)} ${isCelsius ? "°C" : "°F"}`;
    descriptionEl.textContent = data.currentConditions.conditions;
}

searchBtn.addEventListener("click", async () => {
    const city = cityInput.value.trim();
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    const data = await getWeatherData(city);
    if (!data) return;

    currentWeatherData = data;
    isCelsius = true;
    clearError();
    displayWeather(data);

    const gifUrl = await getWeatherGif(data.currentConditions.conditions);
    displayGif(gifUrl);
});

toggleUnitBtn.addEventListener("click", () => {
    if (!currentWeatherData) return;

    isCelsius = !isCelsius;
    displayWeather(currentWeatherData);
});

function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
}

function clearError() {
    errorEl.textContent = "";
    errorEl.hidden = true;
}

function getGifKeyword(condition) {
    const normalized = condition.toLowerCase();

    if (normalized.includes("rain")) return "rain weather";
    if (normalized.includes("cloud")) return "cloudy weather";
    if (normalized.includes("clear")) return "sunny weather";
    if (normalized.includes("snow")) return "snow weather";
    if (normalized.includes("storm")) return "storm weather";
    
    return "weather";
}

async function getWeatherGif(condition) {
    const keyword = getGifKeyword(condition);

    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${keyword}&limit=1&remove_lo_contrast=true&api_key=${GIPHY_API_KEY}`);
        if (!response.ok) {
            throw new Error("GIF fetch failed.");
        }

        const data = await response.json();
        return data.data[0]?.images?.original?.url || null;
    } catch(error) {
        return null;
    }
}

function displayGif(url) {  
    if (!url) return;

    const img = document.createElement("img");
    img.src = url;
    img.alt = "Weather GIF";
    img.style.width = "100%";
    bodyContainer.style.backgroundImage = `url(${url})`;
    bodyContainer.style.backgroundSize = "cover";
    bodyContainer.style.backgroundRepeat = "no-repeat";
    bodyContainer.style.backgroundPosition = "center";
}