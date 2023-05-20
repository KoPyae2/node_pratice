require("dotenv").config();
// const redis = require('redis');

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const db = require("./database/models/index.js");
const redisClient = require('./config/redis.js');
const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middleware/credentials");
const router = require("./routes/index");

const app = express();


const PORT = process.env.PORT || 5006;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));

app.use("/", router);
app.use('/images', express.static('profile'));

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Congratulation Database connect success !");

    // await db.sequelize.sync({ alter: true });
    // console.log("All models are synchronized");

    app.listen(PORT, () => {
      console.log(`Server started successfully, port number: ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
};

start();
