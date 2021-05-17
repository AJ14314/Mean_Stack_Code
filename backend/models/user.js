const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); //plugin to schema

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true //does not throw error not act as validators //it allows some internal optimizations
            //to avoid duplicate email address in db we can use package:- mongoose-unique-validator
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.plugin(uniqueValidator); //now will get error for duplicate email for user

module.exports = mongoose.model("User", userSchema); //collection name is plural form of model name i.e. posts