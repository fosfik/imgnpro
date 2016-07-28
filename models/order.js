var mongoose = require('mongoose');
var counter = require('./ordercounter.js');
var orderSchema = mongoose.Schema({
    testvalue: {type: String},
    name: {type: String}
});
orderSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} },{upsert:true, new: true}, function(error, counter)   {
        if(error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
    }); 
});

module.exports = mongoose.model('ordertest', orderSchema);
