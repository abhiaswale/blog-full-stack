const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { default: mongoose } = require("mongoose");

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://abhi:12345@cluster0.qxhox.mongodb.net/newApp?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("connected to db");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
