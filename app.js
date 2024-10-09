const express = require("express");
const bodyParser = require("body-parser");
let ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let listItem = [];

app.get("/", (req, res) => {
  const today = new Date();
  const current = today.toLocaleString("en-us", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  console.log(current);

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
  res.render("list", { dayName: current, listIt: listItem });
});

app.post("/", (req, res) => {
  listItem.push(req.body.form_input);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server Started");
});
