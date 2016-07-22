var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    userlongname: String,
    password: String,
    email: String,
    accept_terms: Boolean
});


// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
