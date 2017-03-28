var mongoose = require('mongoose');
 
var SpecSchema = new mongoose.Schema({
  name: {type: String},
  format: { type: String},
  format_ext: { type: String},
	background: {type: String},
  backgrndcolor:{type: String},
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
  marginnone:{type: String},
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
  spectype:{type: String},  // La forma en que se hizo la espec (stepbystep o manual)
  disabled: {type:Boolean, default: false},
  typespec:{type:String, default:'normal'}, // Si es gratis o no (free o normal)
  description:{type:String, default:'Sin detalles agregados'},
  maxfiles:{type:Number, default: 0}  // 0 = ilimitado, número máximo de archivos, ejemplo una espec gratis permite solamente 3 archivos.
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
