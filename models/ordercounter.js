var mongoose = require('mongoose');

// Esquema para generar un contador
var CounterSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
// se genera un objeto basado en el esquema contador
module.exports = mongoose.model('OrderCounter', CounterSchema);