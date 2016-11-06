var mongoose = require('mongoose');
var demousercounter = require('./demousercounter.js');
var userSchema = mongoose.Schema({
    userlongname: String,
    username: String,
    password: String,
    email: String,
    accept_terms: Boolean,
    name: String,
    provider: String,
    provider_id: {type:String},
    //photo: String,
    googletoken: String,
    createdAt: {type:Date, default: Date.now},
    usertype:{type:String},
    disabled: {type:Boolean, default: true},
    isworking: {type:Boolean, default: false},
});

userSchema.pre('save', function(next) {
    var doc = this;

    if (doc.userlongname == 'demoimgnpro'){
        console.log(doc);
        demousercounter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} },{upsert:true, new: true}, function(error, counter)   {
            if(error)
                return next(error);
            doc.userlongname  = 'demoimgnpro' + counter.seq;
            console.log(doc);
            next();
        });
    } 
    else{
        next();
    }
});

module.exports = mongoose.model('User', userSchema);

