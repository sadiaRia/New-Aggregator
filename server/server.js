"use strict";
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);
const env = process.env.NODE_ENV || "development";

app.use(express.static("dist"));
const publicPath = path.resolve(__dirname, '..', '..', 'public');

app.use(
    cors({
      origin: function (_origin, callback) {
        if (!_origin) return callback(null, true);
        return callback(null, true);
      },
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
      credentials: true, // enable set cookie
    })
);

app.options("*", cors());

const router = express.Router();
app.use(router);

const dbEnvWrapper = {
  development: 'mongodb://localhost:27017/newsaggregator'
};
const DB_URL = process.env.MONGODB_URI || dbEnvWrapper[env];
// console.log( process.env.DATABASE_URL);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (err.name === "UnauthorizedError") {
    res.status(401).send("Missing authentication credentials.");
  }
  next();
});

server.listen(process.env.PORT || 9000, (err) => {
  if (err) {
    process.exit(1);
  }
  console.log("Server is up and running on port number 900.");

  // mongoose.set('useFindAndModify', false);



  mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Error connecting to MongoDB:', err.message));


  mongoose.connection.on("error", (_err) => {
    if (_err) {
      process.exit(1);
    }
  });

  require("./models");
  fs.readdirSync(path.join(__dirname, "/config/routes")).map((file) =>
      require(`./config/routes/${file}`)(app)
  );
});

app.use(express.static(publicPath));
require('./tasks').startTasks();


router.get("/_status", (req, res) => {
  res.send("ok");
});

module.exports = app;
