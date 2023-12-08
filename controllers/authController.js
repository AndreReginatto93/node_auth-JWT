const User = require("../models/user")
const jwt = require("jsonwebtoken")

//handle errors
const handleErrors = (error) => {
    console.log(error.message, error.code)

    let errors = {}

    if (error != null) {
        if (error.errors != null) {
            Object.keys(error.errors).forEach(element => {
                errors[element] = error.errors[element].message
            });
        }else if (error.code == 11000) {
            errors.email = "Email already exists"
        }else if (error.message != null) {
            errors.password = error.message
        }
    }

    console.log(errors)

    return errors;
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    //(The token should't be on code like this)
    return jwt.sign({ id }, 'testSecret',{
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id})
    } catch (error) {
        let errors = handleErrors(error)
        res.status(400).json(errors)
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id})
    } catch (error) {
        let errors = handleErrors(error)
        res.status(400).json(errors)
    }
}

module.exports.logout_get = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.redirect("/")
        res.status(201);
    } catch (error) {
        let errors = handleErrors(error)
        res.status(400).json(errors)
    }
}
