var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    userlongname: String,
    username: String,
    password: String,
    email: String,
    accept_terms: Boolean,
    name: String,
    provider: String,
    provider_id: {type:String, unique:true},
    photo: String,
    createdAt: {type:Date, default: Date.now}
});


// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
