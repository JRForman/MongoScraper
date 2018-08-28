var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var app = express();

var routes = require("./controllers/controller.js");

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ArticleScraper";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(routes);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect(MONGODB_URI);


app.listen(PORT, function () {
  console.log("Server listening on: http://localhost:" + PORT);
});
