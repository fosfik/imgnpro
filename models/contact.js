var mongoose = require('mongoose');
var ContactSchema = new mongoose.Schema({
    name: {type: String},
    email: { type: String},
	message: {type: String},
	date: { type: Date, default: Date.now }
});
// se genera un objeto basado en el esquema Contact
module.exports = mongoose.model('Contact', ContactSchema);