const path = require('path');
const express = require("express");
// const bodyParser = require("body-parser"); //deprecated
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

(() => {
    console.log(`IIFE`);
})()

mongoose.connect(`mongodb+srv://testuser:${process.env.MONGO_ATLAS_PW}@cluster0.fscz4.mongodb.net/meancoursedb?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    //mongoose.connect(`mongodb://192.168.10.1:27017/test`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to Mongo DB`);
    })
    .catch((e) => {
        console.log(`Connection failed! ${e}`);
    });

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS,PUT,HEAD"
    );
    next();
});

//to extract file we need to use multer and we can use to attach it to certain routes that should be able to accept files

app.use("/api/posts", postsRoutes);

app.use("/api/user", userRoutes);

module.exports = app;