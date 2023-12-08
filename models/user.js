const mongoose = require("mongoose")
const { isEmail } = require("validator");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Minimum password length is 6 characters"],
        set: value => hashPasswordFunction(value)
    }
})

const hashPasswordFunction = (pass) => {
    let salt = bcrypt.genSaltSync()
    let hash = bcrypt.hashSync(pass, salt);
    console.log(hash)
    return hash
}

//static method to login user
userSchema.statics.login = async function(email,password){
    const user = await User.findOne({ email });
    
    if (!user){
        throw Error("Incorrect email or password")
    }
    
    const auth = bcrypt.compareSync(password, user.password)
    if (!auth){
        throw Error("Incorrect email or password")
    }

    return user;
}

const User = mongoose.model("user", userSchema);

module.exports = User;