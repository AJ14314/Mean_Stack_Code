const fs = require('fs');
const path = require('path');

const Post = require("../models/post");

const mongoose = require("mongoose");

const imageCleaner = () => {

    mongoose.connect("mongodb+srv://meancourse:meancourse@cluster0.fscz4.mongodb.net/meancoursedb?retryWrites=true&w=majority")
        .then(() => {
            console.log(`Connected to Mongo DB`);
        })
        .catch(() => {
            console.log(`Connection failed!`);
        });
    Post.find().then((documents) => {
        //instead of returning response we count the number of records by Post.count() and return it.
        console.log(`docs ${documents}`)
        mongoose.connection.close();
        let imageNames = [];
        documents.map(post => {
            imageNames.push((post.imagePath).split('/')[((post.imagePath).split('/')).length - 1]);
        });

        fs.readdir('../images', (err, files) => {
            console.log(err);
            console.log(`resultFiles ${files}`);
            console.log(`resultImages ${imageNames}`);
            files = files.filter(val => !imageNames.includes(val));
            console.log(`FinalImageNames ${files}`);
            for (const file of files) {
                fs.unlink(path.join('../images', file), err => {
                    if (err) throw err;
                });
            }
            console.log(`Cleaner Completed`);
        });
    }).catch((e) => {
        console.log(`Error while fetching ${e}`);
    });

    //console.log(`data in image cleaner ${posts}`);

}
//imageCleaner();

module.exports = imageCleaner;