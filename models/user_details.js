var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    userlongname: String,
    username: String,
    password: String,
    email: String,
    accept_terms: Boolean,
    name: String,
    provider: String,
    provider_id: {type:String},
    //photo: String,
    googletoken: String,
    createdAt: {type:Date, default: Date.now},
    usertype:{type:String},
    disabled: {type:Boolean, default: true}
});


// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
