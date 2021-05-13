const express = require("express");
// const bodyParser = require("body-parser"); //deprecated

const app = express();

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
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(200).json({
    message: "New post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  //res.send(`Rsponse From Express`);
  const posts = [
    {
      id: "saaqewqdas",
      title: "First server side post",
      content: "This is coming from the server",
    },
    {
      id: "sdasd",
      title: "Second server side post",
      content: "This is coming from the server!",
    },
    {
      id: "sdsadasf",
      title: "Third server side post",
      content: "This is coming from the server!!",
    },
  ];
  res.status(200).json({
    message: "Posts fetched successfully",
    posts: posts,
  });
});

module.exports = app;
