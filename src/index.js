const express = require("express");
const { default: mongoose } = require("mongoose");
const bodyparser = require("body-parser");
const route = require("./routes/route.js");

const app = express();
const multer= require("multer");

app.use(bodyparser.json());
app.use( multer().any());


mongoose.connect("mongodb+srv://bookManagement:doreamon@bookmanagecluster.2bamja3.mongodb.net/Group15Database"
    ,

    { useNewUrlParser: true })
    .then(() => console.log("Mongodb is connected"))
    .catch((err) => console.log(err))

app.use("/", route);


app.listen(process.env.PORT || 3000, function () {
    console.log("express app running on port" + (process.env.PORT || 3000))
});



