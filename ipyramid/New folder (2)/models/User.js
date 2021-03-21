const mongoose = require('mongoose')
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose')

//define user schema here\
const UserSchema = new Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    }
})


UserSchema.plugin(passportLocalMongoose)

//export schema

module.exports = mongoose.model('User', UserSchema);