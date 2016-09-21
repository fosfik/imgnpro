var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    numorder: {type: String},
    name: {type: String},
    userid: {type: String},
    date: { type: Date, default: Date.now },
    status: {type: String, default:'Por pagar'},
    imagecount: {type:Number, default:0},
    designerid: {type: String},
    images: [{  imagename: String, width: Number, height: Number, length: Number, position: Number }]
});

module.exports = mongoose.model('orderpacks', orderSchema);
