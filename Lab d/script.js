document.getElementById("getWeather").addEventListener("click", () => {
    const city = document.getElementById("city").value;
    if (!city) {
        alert("Wprowadź nazwę miasta!");
        return;
    }

    const apiKey = "7fbc616e28ff655a8b570486510f2503";

    // Wysyłanie żądania bieżącej pogody za pomocą XMLHttpRequest
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pl&units=metric`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", currentWeatherUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const responseData = JSON.parse(xhr.responseText);
                console.log("Odpowiedź JSON (Current Weather):", responseData);
                displayWeather(responseData);
                setSeasonalBackgroundByDate();
            } else {
                console.error("Błąd podczas pobierania danych:", xhr.statusText);
            }
        }
    };
    xhr.send();

    // Prognoza pogody za pomocą Fetch API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pl&units=metric`;
    fetch(forecastUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Nie udało się pobrać danych o prognozie.");
            return response.json();
        })
        .then((data) => {
            console.log("Odpowiedź JSON (Forecast):", data); // Logowanie danych prognozy do konsoli
            displayForecast(data);
        })
        .catch((error) => console.error("Błąd Fetch API:", error));
});

function displayWeather(data) {
    const resultsDiv = document.getElementById("results");
    if (data) {
        resultsDiv.style.display = "block";
    }

    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    resultsDiv.innerHTML = `
        <h2>Bieżąca pogoda dla: ${data.name}</h2>
        <p><img src="${iconUrl}" alt="${data.weather[0].description}">${data.main.temp.toFixed(1)} °C</p>
        <p>Odczuwalna: ${data.main.feels_like.toFixed(1)} °C</p>
        <p>${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    if (data.list && data.list.length > 0) {
        forecastDiv.style.display = "block";
    }

    forecastDiv.innerHTML = `<h2>Prognoza godzinowa:</h2>`;

    const times = [6, 10, 14, 18, 22];
    const days = {};

    data.list.forEach((item) => {
        const date = new Date(item.dt_txt);
        const hour = date.getHours();

        if (times.includes(hour)) {
            const day = date.toLocaleDateString("pl-PL", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
            });

            if (!days[day]) days[day] = [];
            days[day].push({
                time: hour,
                temp: item.main.temp.toFixed(1),
                desc: item.weather[0].description,
                icon: item.weather[0].icon,
            });
        }
    });

    for (const [day, forecast] of Object.entries(days)) {
        let dayForecastHTML = `<div class="day"><strong>${day}</strong>`;
        forecast.forEach((entry) => {
            const iconUrl = `https://openweathermap.org/img/wn/${entry.icon}.png`;
            dayForecastHTML += `<p><img src="${iconUrl}" alt="${entry.desc}">${entry.time}:00 - ${entry.temp}°C, ${entry.desc}</p>`;
        });
        dayForecastHTML += "</div>";
        forecastDiv.innerHTML += dayForecastHTML;
    }
}

function setSeasonalBackgroundByDate() {
    const body = document.body;
    const currentMonth = new Date().getMonth() + 1;

    if ([12, 1, 2].includes(currentMonth)) {
        body.style.backgroundImage = "url('zima.webp')";
    } else if ([3, 4, 5].includes(currentMonth)) {
        body.style.backgroundImage = "url('wiosna.webp')";
    } else if ([6, 7, 8].includes(currentMonth)) {
        body.style.backgroundImage = "url('lato.webp')";
    } else if ([9, 10, 11].includes(currentMonth)) {
        body.style.backgroundImage = "url('jesien.webp')";
    }

    body.style.transition = "background 0.5s ease";
}
