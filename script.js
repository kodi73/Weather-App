const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const toggleUnitBtn = document.querySelector("#toggle-unit");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    console.log("Search clicked for city: ", city);
});

toggleUnitBtn.addEventListener("click", () => {
    console.log("Temperature unit toggle button clicked.");
});