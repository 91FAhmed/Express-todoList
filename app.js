const express = require("express");
const bodyParser = require("body-parser");
let ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// connect to db
mongoose
  .connect("mongodb://192.168.1.10:27017/todoDB", {
    serverSelectionTimeoutMS: 2000,
  })
  .then(() => console.log("Connection to DB success"))
  .catch((error) => console.log("The connection to DB failed ", error));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

let listItem = [];
let workItem = [];
const today = new Date();
const current = today.toLocaleString("en-us", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

//schema
const todoSchema = new mongoose.Schema({
  name: String,
});

//model
const Item = new mongoose.model("Item", todoSchema);

app.get("/", (req, res) => {
  //Using promises
  // Item.find({})
  // .then((res) => console.log(res.))
  // .catch((error) => console.log("The Item could not be found", error));

  let day = "";

  //   switch (current) {
  //     case 1:
  //       day = "Monday";
  //     case 2:
  //       day = "tuesday";
  //     case 3:
  //       day = "wednesday";
  //     case 4:
  //       day = "thursday";
  //     case 5:
  //       day = "friday";
  //     case 6:
  //       day = "saturday";
  //     case 0:
  //       day = "sunday";
  //       break;
  //     default:
  //       "Error";
  //   }

  Item.find({})
    .then((items) =>
      res.render("list", {
        dayName: current,
        listIt: items,
        listVal: "life",
      })
    )
    .catch((error) => console.log(error));
});

app.post("/", (req, res) => {
  console.log(req.body);
  const itemName = req.body.form_input;

  const itemDocs = new Item({
    name: itemName,
  });

  if (req.body.form_input === "") {
    res.redirect("/");
  } else {
    itemDocs.save().then(() => res.redirect("/"));
  }
});

//custom Error
class customError extends Error {
  constructor(message) {
    super(message); //call parent
    this.name = this.constructor.name; //uses class name instead
    this.errorCode = code; //Error Code
    Error.captureStackTrace(this, this.constructor);
  }
}

app.get("/work", (req, res) => {
  res.render("list", {
    dayName: current,
    listIt: workItem,
    listVal: "Work",
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen(4000, function () {
  try {
    console.log("The server is running ");
  } catch {
    throw new customError("Server Failed");
  }
});
