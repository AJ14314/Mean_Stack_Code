const jwt = require('jsonwebtoken');

//check if token attached then check for token validity
//middleware just a function which executed on the incoming request
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];  //"Bearer <TOKEN>" convention to authenticate
        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }
        jwt.verify(token, 'this_is_the_secret_key_which_is_used_to_generate_token');
        next();
    } catch (error) {
        console.log(`error auth failed ${error}`);
        res.status(401).json({
            message: 'Auth failed!'
        });
    }
}