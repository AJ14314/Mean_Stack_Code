const express = require("express");
// const bodyParser = require("body-parser"); //deprecated
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://meancourse:meancourse@cluster0.fscz4.mongodb.net/meancoursedb?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(`Connected to DB`);
  })
  .catch(() => {
    console.log(`Connection failed!`);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

//to extract file we need to use multer and we can use to attach it to certain routes that should be able to accept files

app.use("/api/posts", postsRouter);

module.exports = app;
