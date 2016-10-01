var mongoose = require('mongoose');
 
module.exports = mongoose.model('user_details',{
    userid: {type: String, ref: 'User'},
    contactname: {type: String}, 
    contactemail: {type: String},
    sel_contactcountry: {type: String},
    chk_factura: {type: String},
    factrfc: {type: String},
    sel_factcountry: {type: String},
    factmunicipio: {type: String},
    factcolonia: {type: String},
    factnum_ext: {type: String},
    factcp: {type: String},
    factpaymethod: {type: String},
    factrazonsocial: {type: String},
    factestado: {type: String},
    factciudad: {type: String},
    factcalle: {type: String},
    factnum_int: {type: String},
    factemail2: {type: String},
    factterminacion: {type: String}
});


// var mongoose = require('mongoose');
// var userSchema = new mongoose.Schema({
//     userlongname: String,
//     password: String,
//     email: String,
//     accept_terms: Boolean
// });
// mongoose.model('User', userSchema);
