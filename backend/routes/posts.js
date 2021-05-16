const express = require("express");
const multer = require("multer"); //requires configuration

const Post = require("../models/post");

const router = express.Router();

const imageCleaner = require('../cronjobs/imageCleaner');

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

router.post("", multer({ storage: storage, }).single("image"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    console.log(`new post ${post}`);
    post.save().then((createdPost) => {
        console.log(`post added result ${JSON.stringify(createdPost)}`);
        res.status(201).json({
            message: "New post added successfully",
            post: {
                // ...createdPost,
                // id: createdPost._id
                post: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        });
    }); //save provided by mongoose package for every model created and it will auto save our post in db
});

router.get("", (req, res, next) => { //for pagination we use query params
    console.log(`req.query ${JSON.stringify(req.query)}`);
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let postQuery = Post.find();
    let documentsResult;
    if (pageSize && currentPage) {
        //console.log(`in if`);
        //for selected posts
        postQuery.skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    //res.send(`Response From Express`);
    postQuery.then((documents) => {
        //instead of returning response we count the number of records by Post.count() and return it.
        documentsResult = documents;
        return Post.count();

    }).then((count) => {
        console.log(`documents fetched ${documentsResult} count ${count}`);
        imageCleaner();
        res.status(200).json({
            message: "Posts fetched successfully",
            posts: documentsResult, //not able to access images because we need to give access to the folder
            maxPosts: count
        });
    })
        .catch((e) => {
            console.log(`Error while fetching ${e}`);
        });
});

router.put("/:id", multer({ storage: storage, }).single("image"), (req, res, next) => {
    //console.log(`req.file ${req.file}`); //undefined if not changes
    let imagePath = req.body.imagePath;
    if (req.file) { //means new file upload
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const updatedPost = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(`updated post ${updatedPost}`);
    Post.updateOne({ _id: req.params.id }, updatedPost)
        .then((result) => {
            console.log("updated result " + JSON.stringify(result));
            res.status(200).json({
                message: `Post updated successfully with id "${req.params.id}"`,
            });
        });
});

router.delete("/:id", (req, res, next) => {
    console.log(`req.params.id ${req.params.id}`);
    Post.deleteOne({
        _id: req.params.id
    })
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
            res.status(404).json({
                message: `Post not found with id "${req.params.id}".`,
            });
        }
    });
});

module.exports = router;