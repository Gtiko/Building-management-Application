const housingRoute = require("./routers/housingRoute");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.listen(8080, () => {
  console.log("connected to 8080...");
});

app.use(
  cors({
    origin: "*",
  })
);

app.use("/housing", housingRoute);

// Error Handling
app.use((req, res) => {
  res.status(404).send("API not supported");
});

app.use((error, req, res) => {
  if (error && error.message) {
    res.send(error.message);
  } else {
    res.send("Backend error");
  }
});
