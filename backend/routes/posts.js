const express = require("express");
const multer = require("multer"); //requires configuration

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); //path is related to server.js path
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("", multer({storage:storage}).single("image"), (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(`new post ${post}`);
  post.save().then((createdPost) => {
    console.log(`post added result ${JSON.stringify(createdPost)}`);
    res.status(201).json({
      message: "New post added successfully",
      postId: createdPost._id,
    });
  }); //save provided by mongoose package for every model created and it will auto save our post in db
});

router.get("", (req, res, next) => {
  //res.send(`Response From Express`);
  // const posts = [
  //   {
  //     id: "saaqewqdas",
  //     title: "First server side post",
  //     content: "This is coming from the server",
  //   },
  //   {
  //     id: "sdasd",
  //     title: "Second server side post",
  //     content: "This is coming from the server!",
  //   },
  //   {
  //     id: "sdsadasf",
  //     title: "Third server side post",
  //     content: "This is coming from the server!!",
  //   },
  // ];

  // Post.find((err,result) => {

  // });
  Post.find()
    .then((documents) => {
      console.log(`documents fething ${documents}`);
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: documents,
      });
    })
    .catch((e) => {
      console.log(`Error while fetching ${e}`);
    });
});

router.put("/:id", (req, res, next) => {
  const updatedPost = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
  });

  Post.updateOne({ _id: req.params.id }, updatedPost).then((result) => {
    console.log("updated result " + result);
    res.status(200).json({
      message: `Post updated successfully with id "${req.params.id}"`,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  console.log(`req.params.id ${req.params.id}`);
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(`delete result ${JSON.stringify(result)}`);
      res.status(200).send({
        message: `Post deleted with id "${req.params.id}".`,
      });
    })
    .catch((e) => {
      console.log(`error while deleting post with id ${req.params.id} ${e}`);
      res.status(422).send({
        message: `error while deleting post with id "${req.params.id}".`,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: `Post not found with id "${req.params.id}".` });
    }
  });
});

module.exports = router;
