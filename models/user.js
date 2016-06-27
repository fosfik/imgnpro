var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    userlongname: String,
    password: String,
    email: String,
    accept_terms: Boolean
});


