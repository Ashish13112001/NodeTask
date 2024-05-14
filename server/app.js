const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();

app.use(cors());

// MongoDB connection
mongoose.connect(
  "mongodb://localhost:27017/hodlinfo",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Schema for storing crypto data
const cryptoSchema = new mongoose.Schema({
  name: String,
  last: Number,
  buy: Number,
  sell: Number,
  volume: Number,
  base_unit: String,
});
const Crypto = mongoose.model("Crypto", cryptoSchema);

const fetchAndStoreCryptoData = async () => {
  try {
    const response = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();
    const dataArray = Object.values(data);

    const top10Cryptos = dataArray.slice(0, 10);
    await Crypto.deleteMany({});
    await Crypto.insertMany(
      top10Cryptos.map((crypto) => ({
        name: crypto.name,
        last: crypto.last,
        buy: crypto.buy,
        sell: crypto.sell,
        volume: crypto.volume,
        base_unit: crypto.base_unit,
      }))
    );
    console.log("Crypto data stored successfully");
  } catch (error) {
    console.error("Error fetching and storing crypto data:", error);
  }
};

// Route to retrieve stored crypto data
app.get("/cryptoData", async (req, res) => {
  try {
    const cryptoData = await Crypto.find({});
    res.json(cryptoData);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch and store crypto data every hour
fetchAndStoreCryptoData();
setInterval(fetchAndStoreCryptoData, 3600000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
