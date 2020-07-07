const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/api-routes");
// const https = require("https");
// const http = require("http");
// const fs = require("fs");

const errorLog = require("./util/logger").errorlog;
const successLog = require("./util/logger").successlog;

const PORT = 8080;
const app = express();
// const clientPORT = 3000;
// const options = {
//   key: fs.readFileSync("/etc/httpd/conf/cert/server.key"),
//   cert: fs.readFileSync("/etc/httpd/conf/cert/server.crt")
// };

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

mongoose.Promise = Promise;

mongoose.connection.on("connected", () => {
  console.log("Connection Established");
});

mongoose.connection.on("reconnected", () => {
  console.log("Connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("Connection Disconnected");
});

mongoose.connection.on("close", () => {
  console.log("Connection Closed");
});

mongoose.connection.on("error", error => {
  console.log("ERROR: " + error);
});

// mongoose.connect("mongodb://localhost:27017/slrdashboard", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });

mongoose.connect(
  "mongodb://mtuser:Vzori%4037ui@10.101.13.120:27017/slrdashboard?authMechanism=SCRAM-SHA-1",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

const connection = mongoose.connection;

// Logging
connection.once("open", function() {
  successLog.info("MongoDB database connection established successfully");
});

// Send message for default URL
app.use((req, res, next) => {
  function escapeHtml(unsafe) {
    Object.keys(unsafe).forEach(key => {
      unsafe[key] = unsafe[key]
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    });
    return unsafe;
  }
  // req.query = escapeHtml(req.query);
  if (typeof req.query === "string") {
  } else if (req.query === "object" && req.query.sortBy) {
    //Custom Sanitation rules
    req.query = escapeHtml(req.query);
    next();
  } else {
    next();
  }
});
app.get("/", (req, res) => res.send("Hello World with Express"));
app.use("/api", apiRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

// app.listen(clientPORT);

// http.createServer(app).listen(8054);
// https.createServer(options, app).listen(PORT);
