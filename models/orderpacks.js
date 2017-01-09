var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    numorder: {type: String},
    name: {type: String},
    userid: {type: String},
    date: { type: Date, default: Date.now },
    date_start_work: { type: Date},
    date_finish_work: { type: Date},
    status: {type: String, default:'Por pagar'},
    isworking: {type: Boolean, default: false},
    isreserve: {type: Boolean, default: false},
    imagecount: {type:Number, default:0},
    designerid: {type: String, ref: 'User'},
    specid:{type: String, ref: 'Orderspecs'},
    date_reserve: {type: Date},
    reserve_byid: {type: String},
    images: [{  imagename: String, width: Number, height: Number, length: Number, position: Number }]
});

module.exports = mongoose.model('orderpacks', orderSchema);
