  var express = require('express');
  var config = require('../config');
  var Orders = require('../models/order.js');
  var OrderPacks = require('../models/orderpacks.js');
  var router = express.Router();
  var paypal = require('paypal-rest-sdk');
  require('../config_paypal');

var paymentId = "PAY-3HK76932GS852015ELBCI4LA";
var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": config.paypal.return_url,
        "cancel_url": config.paypal.cancel_url
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};

// var execute_payment_json = {
//         "payer_id": payer_id,
//         "transactions": [{
//             "amount": {
//                 "currency": "USD",
//                 "total": "1.00"
//             }
//         }]
//     };



router.get('/getpayment', function(req, res) {
     paypal.payment.get(paymentId, function (error, payment) {
        if (error) {
            console.log(error);
           // throw error;
           res.setHeader('Content-Type', 'application/json');
            res.send(error);  
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(payment));  
        }

    });
});

router.get('/createpayment', function(req, res) {
  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          console.log(error);
             // throw error;
          res.setHeader('Content-Type', 'application/json');
          res.send(error); 
      } else {
      
          console.log("Create Payment Response");
          console.log(payment);
          //res.setHeader('Content-Type', 'application/json');
          //res.send(payment);  
          var href;
          console.log(href);
          for (var index = 0; index < payment.links.length; index++) {
          //Redirect user to this endpoint for redirect url
              if (payment.links[index].rel === 'approval_url') {
                  console.log(payment.links[index].href);
                  href = payment.links[index].href;
              }
          }

          if (href != null){
            res.redirect(href);
          }
          else
          {
            res.setHeader('Content-Type', 'application/json');
            res.send(payment);  
          }
      }
  });
});


router.get('/executepayment', function(req, res) {

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
         console.log(error);
             // throw error;
          res.setHeader('Content-Type', 'application/json');
          res.send(error); 
      } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));

          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(payment));  
      }
  });
});

router.get('/return', function(req, res){
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

router.get('/cancel', function(req, res){
  //todo revisar sesion
  console.log(req.body);
  console.log(req.query);

});


// function getPayment(paymentid,cb){
//   paypal.payment.get(paymentid, function (err, payment) {
//         if (err) {
//           console.log(err);
//           cb(1,'Error al consultar el pago: ' + err);
//         } else {
//           cb(0,'',payment);   
//         }

//     });
// };

module.exports = router;

