var mongoose = require('mongoose');
 
var SpecSchema = new mongoose.Schema({
  name: {type: String},
  format: { type: String},
	background: {type: String},
	colormode: {type: String},
	dpi: {type: Number, default: 0},
	dpinone: {type: String},
	userid: {type: String},
	numorder: {type: String},
	date: { type: Date, default: Date.now },
	totalprice: {type: String},
	alignnone: {type: String},
  alignhor: {type: String},
  alignver: {type: String},
  sizenone:{type: String},
  imagesize: {type: String},
  measuresize: {type: String},
  marginmeasure: {type: String},
  margintop: {type: Number, default: 0},
  marginbottom: {type: Number, default: 0},
 	marginright: {type: Number, default: 0},
  marginleft: {type: Number, default: 0},
  naturalshadow: {type: String},
  dropshadow:  {type: String},
	correctcolor: {type: String},
	clippingpath: {type: String},
	basicretouch: {type: String},
  widthsize:{type: String},
  heightsize:{type: String},
  spectype:{type: String}
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
