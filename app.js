const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use("view engine", "ejs");

app.get("/", (req, res) => {
  const today = new Date();

  if (today.getDate() == 3 || today.getDate() == 4) {
    res.write("Its a Holiday");
    console.log("Hold");
  } else {
    res.write("BOOO");
    console.log("Boo");
  }
  res.send();
});

app.listen(3000, () => {
  console.log("server Started");
});
