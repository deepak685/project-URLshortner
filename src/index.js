const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const route = require("./routes/route");
//const route1=require("./routes/index")

app.use("/", route);
//app.use("/url",route1)

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url =
  "mongodb+srv://Deependra1999:Z1ZWVlMvcAFQsu2u@cluster0.4nkid.mongodb.net/url-project";

mongoose
  .connect(url, { useNewUrlParser: true })
  .then(() => {
    console.log("mongodb is connnected");
  })
  .catch((err) => {
    console.log(err);
  });
