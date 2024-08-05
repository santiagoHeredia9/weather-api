const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/weather", (req, res) => {
  fs.readFile(path.join(__dirname, "data", "db.json"), "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading data");
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
