var mongoose = require('mongoose');
var counter = require('./ordercounter.js');
var orderSchema = mongoose.Schema({
    numorder: {type: String},
    name: {type: String},
    userid: {type: String},
    images: [{  url: String, imagetype: String }]
});
orderSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} },{upsert:true, new: true}, function(error, counter)   {
        if(error)
            return next(error);
        doc.numorder = counter.seq;
        next();
    }); 
});

module.exports = mongoose.model('ordertest', orderSchema);
