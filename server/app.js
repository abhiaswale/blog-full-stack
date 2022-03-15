const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const app = express();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { default: mongoose } = require("mongoose");
const path = require("path");
app.use(cors());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
};
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

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
