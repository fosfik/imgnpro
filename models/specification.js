var mongoose = require('mongoose');
 
var SpecSchema = new mongoose.Schema({
    name: {type: String},
    format: { type: String},
	background: {type: String},
	colormode: {type: String},
	dpi: {type: Number, default: 0},
	userid: {type: String}

});
// se genera un objeto basado en el esquema contador
module.exports = mongoose.model('Specification', SpecSchema);

// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
