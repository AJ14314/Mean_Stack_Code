const Post = require("../models/post");

const imageCleaner = require('../cronjobs/imageCleaner');

exports.getPosts = (req, res, next) => { //for pagination we use query params
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
    }).catch((e) => {
        console.log(`Error while fetching ${e}`);
        res.status(500).json({
            message: 'Fetching posts failed!'
        });
    });
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: `Post not found with id "${req.params.id}".`,
            });
        }
    }).catch((e) => {
        console.log(`Error while fetching ${e}`);
        res.status(500).json({
            message: 'Fetching post failed!'
        });
    });
};

exports.createPost = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId //not as part of body but will be part of our token //check-auth we are verifying the token
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
    }).catch(error => {
        res.status(500).json({
            message: `Post creation failed!`
        });
    }); //save provided by mongoose package for every model created and it will auto save our post in db
};

exports.updatePost = (req, res, next) => {
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
        imagePath: imagePath,
        creator: req.userData.userId
    });
    console.log(`updated post ${updatedPost}`);
    Post.where({ creator: req.userData.userId, _id: req.params.id }).updateOne({ _id: req.params.id }, updatedPost, { "upsert": false })
        .then((result) => {
            console.log("updated result " + JSON.stringify(result));
            const { matchedCount, modifiedCount } = result;
            if (result.nModified > 0 || result.n > 0) {
                res.status(200).json({
                    message: `Post updated successfully with id "${req.params.id}"`,
                });
            } else {
                res.status(401).json({
                    message: `Not authorized to update the post`,
                });
            }

        }).catch(e => {
            console.log(`error while updating the post ${e}`);
            res.status(500).json({
                message: 'Post updation failed!'
            })
        });
    // Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, updatedPost) //restrict user who is not created the post to edit
    //     .then((result) => {
    //         console.log("updated result " + JSON.stringify(result));
    //         if (result.nModified > 0) {
    //             res.status(200).json({
    //                 message: `Post updated successfully with id "${req.params.id}"`,
    //             });
    //         } else {
    //             res.status(401).json({
    //                 message: `Not authorized to update the post`,
    //             });
    //         }

    //     }).catch(e => {
    //         console.log(`error while updating the post ${e}`);
    //     });
};

exports.deletePost = (req, res, next) => {
    console.log(`req.params.id ${req.params.id}`);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then((result) => {
            console.log(`delete result ${JSON.stringify(result)}`);
            if (result.n > 0) {
                res.status(200).send({
                    message: `Post deleted with id "${req.params.id}"`,
                });
            } else {
                res.status(401).send({
                    message: `Not authorized to delete the post`,
                });
            }
        })
        .catch((e) => {
            console.log(`error while deleting post with id ${req.params.id} ${e}`);
            res.status(500).send({
                message: `error while deleting post with id "${req.params.id}".`,
            });
        });
};