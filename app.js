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
  Item.find({})
    .then(function (value) {
      if (value.length === 0) {
        Item.insertMany([
          { name: "Welcome" },
          { name: "Press '+' to add new todos" },
          { name: "<--- Hit 'Checkbox' to remove Completed todos" },
        ]);
      } else {
        console.log("Has items");
      }
    })
    .catch(function (error) {
      throw new customError("Failed to find Item.find length");
    });

  // let day = "";

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

app.post("/delete", (req, res) => {
  const ObjectId = req.body.checkbox;

  async function deleteById(id) {
    try {
      const trimmedId = id.trim();
      if (trimmedId.length != 24) {
        throw new Error("The id is not in 24 charecters long");
      }

      const ObjId = mongoose.Types.ObjectId.createFromHexString(trimmedId);
      const deletedDoc = await Item.findByIdAndDelete(ObjId);

      if (deletedDoc) {
        res.redirect("/");
        console.log("Successfully deleted document");
      } else {
        console.log("No documents found");
      }
    } catch (error) {
      console.log("error Deleting", error);
    }
  }
  deleteById(ObjectId);
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
``;
