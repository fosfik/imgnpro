var nodemailer = require('nodemailer');
var transporter = require("nodemailer-smtp-transport")
var mailSender = JSON.parse(process.env.MAIL_SENDER);
var transporter = nodemailer.createTransport(transporter({
    host : mailSender.host,
    ignoreTLS : mailSender.ignoreTLS,
    secureConnection : mailSender.secureConnection,
    port: mailSender.port,
    auth : {
        user : mailSender.user,
        pass : mailSender.pass
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
