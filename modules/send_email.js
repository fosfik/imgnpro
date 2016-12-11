var nodemailer = require('nodemailer');
var transporter = require("nodemailer-smtp-transport")
var transporter = nodemailer.createTransport(transporter({
    host : "mail.mail-imgnpro.com",
    ignoreTLS : true,
    secureConnection : false,
    port: 2525,
    auth : {
        user : "becomeapartner@mail-imgnpro.com",
        pass : "1m4g3npr0"
    }
}));
var sendEmail = function(emailOptions){
	transporter.sendMail(emailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    console.log('Message sent: ' + info.response);
	});
}
module.exports.sendEmail = sendEmail;
