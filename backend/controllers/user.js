const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");
exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash //encrypted we will save
        });

        user.save().then((result) => {
            console.log(`user saved with result ${JSON.stringify(result)}`);
            res.status(201).json({
                message: 'User signup successfully',
                result: result
            });
        }).catch((e) => {
            console.log(`error while user signup ${e}`);
            res.status(500).json({
                // message: 'User signup service unavailable',
                // error: {
                message: 'Invalid authentication credentials!'
                // }
            });
        })
    })

};

exports.userLogin = (req, res, next) => {
    //we will validate the user and send the token to front-end
    let userFound;
    User.findOne({
        email: req.body.email
    })
        .then((user) => {
            console.log(`user here ${JSON.stringify(user)}`);
            if (!user) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            userFound = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) { //result is boolean
                console.log(`false in password matching ${result}`);
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            //JWT for success authetication package jsonwebtoken
            console.log(`creating jwt token`);
            //jwt.sign(input,secretkey/password,[optional]{expiresIn}) to encrypt
            const token = jwt.sign({ username: userFound.username, email: userFound.email, userId: userFound._id },
                "this_is_the_secret_key_which_is_used_to_generate_token", { expiresIn: "1h" });
            console.log(token);
            res.status(200).json({
                token: token,
                expiresIn: 3600, //seconds
                userId: userFound._id
            });
        }).catch((err) => {
            console.log(`error in password checking ${err}`);
            return res.status(401).json({
                message: 'Invalid login credetials!'
            });
        });
    //     .catch (e => {
    //     console.log(`error while checking user in DB ${e}`);
    //     res.status(500).json({
    //         message: 'User login service unavailable',
    //         error: e
    //     });
    // });
};

exports.fetchUserProfile = (req, res, next) => {
    console.log(`fething user with id ${req.params.userid}`)
    User.findOne({
        _id: req.params.userid
    }).then(user => {
        if (!user) {
            console.log(`user not found`);
            return res.status(404).json({
                message: 'User not found!'
            });
        }
        console.log(`user found ${JSON.stringify(user)}`);
        res.status(200).json({
            message: 'User details',
            userDetails: user
        });
    })
}