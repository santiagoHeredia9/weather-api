const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para CORS
app.use(cors());

// Ruta para obtener datos meteorológicos
app.get('/api/weather', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Función para actualizar los datos meteorológicos
const updateWeatherData = () => {
  fs.readFile(path.join(__dirname, 'data', 'db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading data', err);
      return;
    }

    const weatherData = JSON.parse(data);

    // Simulación de cambios de clima
    weatherData.ArgentinaStateWeathers.forEach(cityWeather => {
      cityWeather.grade = Math.floor(Math.random() * 35) - 10; // Temperatura entre -10 y 35 grados
      cityWeather.wind = Math.floor(Math.random() * 30); // Viento entre 0 y 30 km/h
      cityWeather.humidity = Math.floor(Math.random() * 100); // Humedad entre 0 y 100%
      cityWeather.sol = Math.random() < 0.5;
      cityWeather.nublado = Math.random() < 0.5;
      cityWeather.lloviendo = !cityWeather.sol && Math.random() < 0.3; // Lluvia si no hay sol y 30% de probabilidad
    });

    // Guardar los datos actualizados
    fs.writeFile(path.join(__dirname, 'data', 'db.json'), JSON.stringify(weatherData, null, 2), (err) => {
      if (err) {
        console.error('Error writing data', err);
      }
    });
  });
};

// Actualizar datos cada hora (3600000 ms)
setInterval(updateWeatherData, 3600000);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  updateWeatherData(); // Actualizar al iniciar el servidor
});
