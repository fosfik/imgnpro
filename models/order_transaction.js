var mongoose = require('mongoose');
var orderSchema = mongoose.Schema({
    numorder: {type: String},
    Ds_Amount: {type: String},
    Ds_Currency: {type: String},
    Ds_Order: {type: String},
    Ds_MerchantCode: {type: String},
    Ds_Terminal: {type: String},
    Ds_Signature: {type: String},
    Ds_Response: {type: String},
    Ds_MerchantData: {type: String},
    Ds_SecurePayment: {type: String},
    Ds_TransactionType: {type: String},
    Ds_ConsumerLanguage: {type: String},
    Ds_ErrorCode: {type: String},
    Ds_ErrorMessage: {type: String},
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Order_transaction', orderSchema);
