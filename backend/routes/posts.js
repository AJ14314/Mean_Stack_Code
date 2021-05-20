const express = require("express");

const checkAuth = require("../middleware/check-auth");

const extractFile = require("../middleware/file-path-fetch");

const postController = require('../controllers/posts');

const router = express.Router();

router.get("", postController.getPosts); //calling without brackets to passing just reference instead of executing

router.get("/:id", postController.getPost);

router.post("", checkAuth, extractFile, postController.createPost);

router.put("/:id", checkAuth, extractFile, postController.updatePost);

router.delete("/:id", checkAuth, postController.deletePost);

module.exports = router;