const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //check json web token exists and is verified
    if (!token){
        res.redirect("/login")
    }
    jwt.verify(token, "testSecret", (error, decodedToken) => {
        if (error){
            console.log(error.message)
            res.redirect("/login")
        }
        console.log(decodedToken)
        next()
    })
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, "testSecret", async (error, decodedToken) => {
            if (error){
                console.log(error.message)
                res.locals.user = null;
                next()
            }else{
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser}