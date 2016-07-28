var mongoose = require('mongoose');
 
module.exports = mongoose.model('Orderseq',{
    _id: String,
    seq: Number
});






// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
