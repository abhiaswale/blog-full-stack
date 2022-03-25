const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const { default: mongoose } = require("mongoose");
const path = require("path");
app.use(cors());

const fileStorage = multer.diskStorage({
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
app.use((error, req, res, next) => {
  console.log(error.message);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("connected to db");
    app.listen(process.env.PORT || 8080);
  })
  .catch((err) => {
    console.log(err);
  });
