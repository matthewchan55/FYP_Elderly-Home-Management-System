const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

//Define the property on each workout document
//when created, timestamp automatically generate
const userSchema = new Schema({
    account: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    userType: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        //required: true
    },    
    firstName: {
        type: String, 
        //required: true
    },
    staffID: {
        type: Number,
        unique: true
        //required: true
    },
    address: {
        type: String, 
        //required: true
    },
    phoneNum: {
        type: String, 
        //required: true
    },
    sex: {
        type: String, 
        //required: true
    },
    HKID: {
        type: String, 
        //required: true
    }
}, {timestamps: true})

// static signup method 
userSchema.statics.signup = async function (userInfo){
    // Validation
    const {account, password, staffID} = userInfo

    if(!account || !password){
        throw Error('All fields must be filled')
    }

    const exists = await this.findOne({account})

    if(exists){
        throw Error('Account already in use')
    }

    const existStaffID = await this.findOne({staffID})
    if(existStaffID){
        throw Error('This staff already owns a account')
    }

    // Hashing (mern authentication #3)
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({...userInfo, password: hash})

    return user
}


// static login method
userSchema.statics.login = async function(account, password) {
    // Validation
    if(!account || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({account})
    if(!user){
        throw Error('Invalid account or password')
    }

    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Invalid account or password')
    }
    console.log(user)
    return user
}


// automatically create a new collection in MongoDB
module.exports = mongoose.model('User', userSchema)



