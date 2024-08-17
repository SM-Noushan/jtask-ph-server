require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const productsRoutes = require("./routes/productsRoutes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://supershop-jtask-ph-by-sm-nowshan.vercel.app",
    ],
  })
);

app.use(bodyParser.json());
app.use("/api", productsRoutes);

app.get("/", (req, res) => {
  res.send("SuperShop Server Running");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
