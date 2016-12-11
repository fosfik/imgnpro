var express = require('express');
var config = require('../config');
var Orders = require('../models/order.js');
var OrderPacks = require('../models/orderpacks.js');
var router = express.Router();
var paypal = require('paypal-rest-sdk');
require('../config_paypal');


router.get('/return', require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
  //todo revisar sesion
  console.log(req.body);
  console.log(req.query);
  var paymentId = req.query['paymentId'];
  var payer_id = req.query['PayerID']; 
  var execute_payment_json = {
        "payer_id": payer_id
  };

  Orders.findOne({paymentId:paymentId},function(err,orderrecord){
    if (err){
       res.redirect( '/error' );
     }
     else
     {
        if(orderrecord){
            paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                   console.log(error);
                       // throw error;
                   res.redirect( '/error' );
                } else {
                    console.log("Get Payment Response");
                    console.log(JSON.stringify(payment));

                  var numorder = orderrecord.numorder.replace(/0/g, ''); // quita los ceros del pedido
                  var conditions = { numorder: numorder }
                    , update = { $set: { status: 'En Proceso' }}
                    , options = { multi: true };
              
                    Orders.update(conditions, update, options, function (err, numAffected) {
                      // numAffected is the number of updated documents
                     
                      //console.log(numAffected);
                      if (err){
                          console.log(err);
                          res.redirect( '/error/' + numorder );
                      }
                      else{
                          // actualizar paquetes

                          OrderPacks.update(conditions, update, options, function (err, numAffected) {
                            // numAffected is the number of updated documents
                           
                            //console.log(numAffected);
                            if (err){
                                console.log(err);
                                res.redirect('/error/' + numorder );
                            }
                            else{
                                // actualizar paquetes
                                res.redirect('/thankyou/' + numorder );
                            }
                          });
                          //cb( 0,'Se actualizó el estatus del pedido', href);
                      }
                    });
              }
            });
        }
        else
        {
           res.redirect( '/error' );
        }

     }

  });

});

router.get('/cancel', require('connect-ensure-login').ensureLoggedIn('/login'), function(req, res){
  //todo revisar sesion
  console.log(req.body);
  console.log(req.query);
  var paymentId = req.query['paymentId'];
  var payer_id = req.query['PayerID']; 
  var execute_payment_json = {
        "payer_id": payer_id
  };
  res.redirect( '/error' );

});

module.exports = router;

