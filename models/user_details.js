var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
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
    disabled: {type:Boolean, default: true}



    contactname:Juan Ernesto
contactemail:jerh56@gmail.com
contactcountry:DE
chkfactura:factura
factrfc:RAHJ760926P65
factcountry:AD
factmunicipio:Culiacan
factcolonia:Las vegas
factnum_ext:56788
factcp:788976
factpaymethod:cre
factrazonsocial:Patito Inc
factestado:Sinaloa
factciudad:Culiacan
factcalle:12334
factnum_int:1233
factemail2:hghsfg@dgf.com
factterminacion:5678
});


// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
