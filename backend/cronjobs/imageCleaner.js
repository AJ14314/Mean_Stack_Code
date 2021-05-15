const fs = require('fs');
const path = require('path');
const imageCleaner = (posts) => {
    console.log(`data in image cleaner ${posts}`);
    let imageNames = [];
    posts.map(post => {
        imageNames.push((post.imagePath).split('/')[((post.imagePath).split('/')).length - 1]);
    });

    fs.readdir('backend/images', (err, files) => {
        console.log(err);
        console.log(`resultFiles ${files}`);
        console.log(`resultImages ${imageNames}`);
        files = files.filter(val => !imageNames.includes(val));
        console.log(`FinalImageNames ${files}`);
        for (const file of files) {
            fs.unlink(path.join('backend/images', file), err => {
                if (err) throw err;
            });
        }
    });
}

module.exports = imageCleaner;