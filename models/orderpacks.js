var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    numorder: {type: String},
    name: {type: String},
    userid: {type: String},
    date: { type: Date, default: Date.now },
    date_start_work: { type: Date},
    date_end_end: { type: Date},
    status: {type: String, default:'Por pagar'},
    isworking: {type: Boolean, default: false},
    imagecount: {type:Number, default:0},
    designerid: {type: String},
    specid:{type: String, ref: 'Orderspecs'},
    images: [{  imagename: String, width: Number, height: Number, length: Number, position: Number }]
});

module.exports = mongoose.model('orderpacks', orderSchema);
