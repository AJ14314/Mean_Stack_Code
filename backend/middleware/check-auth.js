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
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); //using it to fetch while inserting new post
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };//every middleware who is using the checkAuth have access to these new fields
        next();
    } catch (error) {
        console.log(`error auth failed ${error}`);
        res.status(401).json({
            message: 'You are not authenticated!'
        });
    }
}