var mongoose = require('mongoose');
var express = require('express');
var app = express();
if (app.get('env') !== 'development') {
 var  url = 'mongodb://admin:123456@ds051903.mlab.com:51903/heroku_554zpg9r';
}
else{
  var  url = 'mongodb://admin:123456@ds051903.mlab.com:51903/heroku_554zpg9r';	
 //var  url = 'mongodb://localhost/passport';
}
mongoose.connect(url, function(err) {
    if (err){
		throw err;
    } 
    else{
    	console.log('Se conectó a la BD');
    }
});
       
 
