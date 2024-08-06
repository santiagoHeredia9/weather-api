const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

const updateWeatherData = () => {
  fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading data", err);
      return;
    }

    const weatherData = JSON.parse(data);

    weatherData.ArgentinaStateWeathers.forEach((cityWeather) => {
      cityWeather.grade = Math.floor(Math.random() * 35) - 10;
      cityWeather.wind = Math.floor(Math.random() * 30);
      cityWeather.humidity = Math.floor(Math.random() * 100);
      cityWeather.sol = Math.random() < 0.5;
      cityWeather.nublado = Math.random() < 0.5;
      cityWeather.lloviendo = !cityWeather.sol && Math.random() < 0.3;

      if (cityWeather.lloviendo) {
        cityWeather.image = "/public/images/lluvia.png";
      } else if (cityWeather.nublado) {
        cityWeather.image = "/public/images/nublado.png";
      } else {
        cityWeather.image = "/public/images/soleado.png";
      }
    });

    fs.writeFile(
      path.join(__dirname, "data", "db.json"),
      JSON.stringify(weatherData, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing data", err);
        }
      }
    );
  });
};

app.get("/api/weather", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.get("/api/weather/:id", (req, res) => {
  const id = parseInt(req.params.id, 10); // Convertir el parámetro de ruta a número entero
  fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Error reading data" });
      return;
    }

    const weatherData = JSON.parse(data);
    const cityWeather = weatherData.ArgentinaStateWeathers.find(
      (weather) => weather.id === id
    );

    if (cityWeather) {
      res.json(cityWeather);
    } else {
      res.status(404).json({ error: "City not found" });
    }
  });
});

setInterval(updateWeatherData, 3600000);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  updateWeatherData();
});
