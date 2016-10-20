var express = require('express');
var aws = require('aws-sdk');
var router = express.Router();
//var cloudinary = require('cloudinary');
var passport = require('passport');
var sha1 = require('sha1');
//var passport = require('passport-local');
//var Strategy = require('passport-facebook').Strategy;
var config = require('../config');
var path = require('path');
var Orders = require('../models/order.js');
var Order_transaction = require('../models/order_transaction.js');
var OrderPacks = require('../models/orderpacks.js');
var OrderSpec = require('../models/orderspecs.js');
var User = require('../models/user.js');
var User_details = require('../models/user_details.js');
var Spec = require('../models/specification.js');
var Contact = require('../models/contact.js');
var ordersinproc  = 0;

aws.config.region = 'us-east-1';
var S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'imgnpro';
var S3_BUCKET_NAME_DONE = process.env.S3_BUCKET_NAME_DONE || 'imgnprodone';
var S3_BUCKET_NAME_THUMB = process.env.S3_BUCKET_NAME_THUMB|| 'imgnprothumb';


var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://jerh56%40gmail.com:1J79ol4f*3@smtp.gmail.com');

var transporter = require("nodemailer-smtp-transport")

var transporter = nodemailer.createTransport(transporter({
    host : "mail.mail-imgnpro.com",
    ignoreTLS : true,
    secureConnection : false,
    port: 2525,
    auth : {
        user : "becomeapartner@mail-imgnpro.com",
        //pass: "m0r3n0"
        pass : "1m4g3npr0"
    }
}));


/* SOAP */

// var easysoap = require('easysoap');
//   //http://www.banxico.org.mx/DgieWSWeb/DgieWS
//     // define soap params
//     var params = {
//     host   : 'http://www.banxico.org.mx',
//     path   : '/DgieWSWeb/DgieWS',
//     wsdl   : '/DgieWSWeb/DgieWS?WSDL'

    // set soap headers (optional)
    // headers: [{
    //         'name'     : 'item_name',
    //         'value'    : 'item_value',
    //         'namespace': 'item_namespace'
    //     }]
    //}
  
    /*
     * create the client
     */ 
//       var clientOptions = {
//                    secure : false 
//     };
//     var soapClient = easysoap.createClient(params,clientOptions);

//     soapClient.getAllFunctions()
//     .then((functionArray) => { console.log(functionArray); })
//     .catch((err) => { throw new Error(err); });

// // ,
// //                     '' : {
// //                                  'ExecuteXML' : 1
// //

// soapClient.getMethodParamsByName('tasasDeInteresBanxico', function(err,mm){
//   console.log("OK");
// });
// // .then((methodParams) => { 
// //         console.log(methodParams);
// //         console.log(methodParams.response); 
// //       })
// // .catch((err) => { throw new Error(err); });
//            //         }

// soapClient.call({method: 'tiposDeCambioBanxico',
//       attributes: {
//               xmlns: 'http://ws.dgie.banxico.org.mx'
//             },
//        params: {
        
//             } 
//         })
//       // .done((data, header) => {

//       //   console.log(data, header);
//       // })
//         .then((callResponse) => { 
//           console.log('ok');
//       console.log(callResponse.data); // response data as json
//             console.log(callResponse.body); // response body
//       console.log(callResponse.header);  //response header
//         })
//     .catch((err) => { throw new Error(err); });

    // soapClient.call({'tiposDeCambioBanxico' : 'Execute'})
    // .then(function (callResponse) {
    //         console.log(callResponse);
    //     })
    // .catch(function (err) {
    //     console.log("Got an error making SOAP call: ", err);
    // });

    /*
     * get the method params by given methodName
         */



// console.log(process.env.AWS_ACCESS_KEY_ID);
// console.log(process.env.AWS_SECRET_ACCESS_KEY);
//console.log(fillzero(23456, '0000000'));
// TODO agregar seguridad a esta ruta




router.get('/listorders/:limit', function(req, res) {
  Orders.find({'userid':req.user._id},function(err, orders) {
    // In case of any error return
     if (err){
       console.log('Error al consultar: ' + err);
     }
     //console.log("prueba 2");
   // already exists
    if (orders.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orders); 

    } 
    else {
      console.log('No se encontraron pedidos');
    }
   
  }).select('imagecount numorder status date specid').sort('-date').limit(parseInt(req.params.limit));
});

// TODO agregar seguridad a esta ruta
router.get('/listorders', function(req, res) {
  Orders.find({'userid':req.user._id},function(err, orders) {
    // In case of any error return
    //console.log(orders);
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (orders.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orders); 

    } 
    else {
      console.log('No se encontraron pedidos');
    }
   
  }).select('imagecount numorder status date').sort('-date');
});

// Filtrar los paquetes que puede trabajar el diseñador
router.get('/packagesforwork', function(req, res) {
  OrderPacks.find({'status':'En Proceso', 'isworking':false},function(err, OrderPacks) {
    // In case of any error return
    //console.log(OrderPacks);
     if (err){
       console.log('Error al consultar ' + err);
     }
     //console.log("prueba 2");
   // already exists
    if (OrderPacks.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(OrderPacks); 

    } 
    else {
      console.log('No se encontraron paquetes de pedidos');
    }
   
  }).select('_id numorder imagecount').sort('numorder');
});


// TODO agregar seguridad a esta ruta
router.get('/listallorders', function(req, res) {
  Orders.find({},function(err, orders) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (orders.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orders); 

    } 
    else {
      console.log('No se encontraron pedidos');
    }
   
  }).select('imagecount numorder status date');
});

// TODO agregar seguridad a esta ruta
router.get('/listallorderpacks', function(req, res) {
  OrderPacks.find({status:'En Proceso'},function(err, orderpacks) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (orderpacks.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orderpacks); 

    } 
    else {
      console.log('No se encontraron paquetes de pedidos');
    }
   
  }).select('_id imagecount numorder status date name userid isworking').sort({date:-1});
});

router.get('/listorderpack/:orderpackid', function(req, res) {
  OrderPacks.find({'_id':req.params.orderpackid},function(err, orderpack) {
    // In case of any error return
     if (err){
       console.log('Error al consultar un paquete de un pedido');
     }
     //console.log("prueba 2");
   // already exists
    if (orderpack.length > 0) {
      //console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orderpack); 
      //res.render('de_package_get', {orderpack:orderpack});

    } 
    else {
      console.log('No se encontró el paquete del pedido ' + req.params.orderpackid);
    }
   
  }).select('_id imagecount numorder status date name userid isworking images');
});


// TODO agregar seguridad a esta ruta
router.get('/listspecs', function(req, res) {
  
  Spec.find({'userid':req.user._id, 'disabled':false},function(err, specs) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (specs.length > 0) {
      //console.log('se encontraron especificaciones');
      res.setHeader('Content-Type', 'application/json');
      res.send(specs); 
    } 
    else {
      console.log('No se encontraron especificaciones');
    }
  }).select('_id name date totalprice totalpriceMXN').sort('-date');
});

// TODO agregar seguridad a esta ruta
// TODO usar una sola ruta para consultar especificaciones
router.get('/listspecs/:limit', function(req, res) {
  
  Spec.find({'userid':req.user._id, 'disabled':false},function(err, specs) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (specs.length > 0) {
      //console.log('se encontraron especificaciones');
      res.setHeader('Content-Type', 'application/json');
      res.send(specs); 
    } 
    else {
      console.log('No se encontraron especificaciones');
    }
  }).select('_id name date totalprice totalpriceMXN typespec').sort('-date').limit(parseInt(req.params.limit));
});

/* Crea un nuevo contacto. */
// Related pages: contacto.html
  router.post('/newcontact', function(req, res) {
    //console.log(req.body);
    var newContact = new Contact();
    newContact.name = req.body['name'];
    newContact.email = req.body['email'];
    newContact.message = req.body['message'];
    newContact.save(function(err) {
      if (err){
          console.log('No se pudo guardar el contacto: ' + err);  
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el contacto'})); 
      }
      else{

            var mailOptions = {
                from: '"Contact" <server@mail-imgnpro.com>', // sender address
                to: 'hi@mail-imgnpro.com, jerh56@gmail.com, jmoreno@mail-imgnpro.com', // list of receivers
                subject: 'Hola', // Subject line
                text: '', // plaintext body
                //html: '<a href="www.imgnpro.com/confirmuser"</a>' // html body
                html: '<html>' + 'Hola, mi nombre es ' + newContact.name + '<br><b>' + 
                newContact.message + '</b><br>' + 'Mi correo electrónico es: <b>' + newContact.email + '</b></html>'  // html body
            };
            //console.log(mailOptions);
            //send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 0, message: 'Se guardó el contacto'})); 
      }
    });  
  });
 
// Confirma la aceptación del pedido.
  router.post('/confirmOrder/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
              //res.render('historial', {message: req.flash('message'), user: req.user, countorders:count });
           findaorder(req.params.numorder,function(error,order){ 
              //console.log(order); 
              findanyorderspec(order[0].specid, function(error, spec){
                //console.log(spec);
                //console.log(req.user);
                doConfirmOrder(req.params.numorder, req, spec[0].typespec ,function(tipomsg,message,href){
                    //console.log(spec);
                    //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
                  

                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: tipomsg, message: message, href:href})); 
                    //res.render('especificaciones1', {message: 'Prueba', user: req.user, href:'thankyou'});
                });
              });  
            });  
  });


/* Crea un nuevo pedido. */
  router.post('/neworder', function(req, res) {
    // Display the Login page with any flash message, if any
   // todo: modificar este try catch
   try {
    //console.log(req.body['imageUploadInfos']);
    //console.log(req.params);
    var imageUploadInfos = JSON.parse(req.body['imageUploadInfos']);

//findaspecfull(specid, disabled,
//console.log('ID:' + req.body.specid);
    findaspecfull(req.body.specid,true,function(error,message,spec){
    // console.log(imageUploadInfos.length);
    if (error == 1){
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el pedido'})); 
    }
    else
     {
        if (spec[0].maxfiles > 0 && (imageUploadInfos.length > spec[0].maxfiles )){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
           error: 1, message: 'Para este tipo de especificación solamente se permiten '+ spec[0].maxfiles + ' archivos'} 
           )); 

        }
        else{

            //console.log(spec);
            var newOrderSpec = new OrderSpec();
            newOrderSpec.name = spec[0].name;
            newOrderSpec.format = spec[0].format;
            newOrderSpec.format_ext =spec[0].format_ext;
            newOrderSpec.colormode =spec[0].colormode;
            newOrderSpec.background =spec[0].background;
            newOrderSpec.backgrndcolor =spec[0].backgrndcolor;
            newOrderSpec.dpi =spec[0].DPI;
            newOrderSpec.dpinone =spec[0].dpinone;
            newOrderSpec.userid =spec[0].userid;  
            newOrderSpec.alignnone =spec[0].alignnone;
            newOrderSpec.alignhor =spec[0].alignhor;
            newOrderSpec.alignver =spec[0].alignver;
            newOrderSpec.sizenone =spec[0].sizenone;
            newOrderSpec.imagesize =spec[0].imagesize;
            newOrderSpec.marginnone =spec[0].marginnone;
            newOrderSpec.marginmeasure =spec[0].marginmeasure;
            newOrderSpec.measuresize =spec[0].measuresize;
            newOrderSpec.margintop =spec[0].margintop;
            newOrderSpec.marginbottom =spec[0].marginbottom;
            newOrderSpec.marginright =spec[0].marginright;
            newOrderSpec.marginleft =spec[0].marginleft;
            newOrderSpec.naturalshadow =spec[0].naturalshadow;
            newOrderSpec.dropshadow =spec[0].dropshadow;
            newOrderSpec.correctcolor =spec[0].correctcolor;
            newOrderSpec.clippingpath =spec[0].clippingpath;
            newOrderSpec.basicretouch =spec[0].basicretouch;
            newOrderSpec.widthsize =spec[0].widthsize;
            newOrderSpec.heightsize =spec[0].heightsize;
            newOrderSpec.spectype =spec[0].spectype;
            newOrderSpec.typespec =spec[0].typespec;
            newOrderSpec.date =spec[0].date;
            newOrderSpec.totalprice =spec[0].totalprice;
            newOrderSpec.totalpriceMXN =spec[0].totalpriceMXN;
            newOrderSpec.numorder =spec[0].numorder;
            newOrderSpec.disabled =spec[0].disabled;
            newOrderSpec.maxfiles =spec[0].maxfiles;
            newOrderSpec.save(); // Se clona la spec
            //console.log(newOrderSpec._id);

          // todo bien
        var numorderstr="";
        var newOrder = new Orders();
        //newOrder.name = 'orderfotos';
        newOrder.userid = req.user._id;
        newOrder.imagecount = req.body['imagecount'];
        newOrder.specid = newOrderSpec._id
        
        // modificar esto 
        newOrder.totalpay = req.body.totalpay;
        newOrder.totalpayMXN = req.body.totalpay * parseFloat(config.prices.dollar);

        if (spec[0].typespec == 'free'){
          newOrder.status = 'Por pagar';
        }
        else
        {
          newOrder.status = 'Por pagar';
        }

        // todo: recorrer el req.body para obtener los datos de las imagenes
        
        //console.log(imageUploadInfos);

        for (var i=0; i < imageUploadInfos.length; i++){
            //i === 0: arr[0] === undefined;
            //i === 1: arr[1] === 'hola';
            //i === 2: arr[2] === 'chau';
            imageUploadInfos[i].position = i+1;
            //console.log(imageUploadInfos[i].position);
            newOrder.images.push(imageUploadInfos[i]);

        }

               // save the user
        newOrder.save(function(err) {
          if (err){
              //console.log(newOrder);
              //console.log(newOrder.images);
              console.log('No se pudo guardar el pedido: '+err); 
              //res.render('como2', {message: req.flash('message')}); 
              //throw err;  
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el pedido'})); 


          }
          else{
            //console.log(' Se guardó el pedido'); 
            //console.log(newOrder.numorder);
            
            // res.render('como2', {message: req.flash('message')});
            numorderstr = String(newOrder.numorder);
            //console.log(numorderstr);
            // inhabilitar la especificacion gratuita para que el cliente no la pueda volver a usar
            disableSpec(req.body.specid,function(err,message_spec){});

              // crear paquetes de trabajo
             //console.log('cantidad imagenes ' + newOrder.images.length());

            var packagelenght = config.package.length;
            var imagecount = imageUploadInfos.length;
            var numpacksfull = Math.floor(imagecount/packagelenght);
            var otherfiles = (imagecount % packagelenght);
             // crea un registro
            var lownumber = 1;
            var highnumber = packagelenght;
            for (var i=1; i <= numpacksfull; i++){
                  var newOrderPack = new OrderPacks();
                  newOrderPack.status = newOrder.status;  
                  newOrderPack.userid = newOrder.userid;
                  newOrderPack.numorder = newOrder.numorder;
                  newOrderPack.specid = newOrderSpec._id;
                  newOrderPack.name = 'Package ' + i;
                  newOrderPack.userid = newOrder.userid;
                  newOrderPack.date = Date();
                  newOrderPack.imagecount = (highnumber - lownumber) + 1;
                   // almacenar los datos del paquete
                   //console.log(lownumber + ', ' + highnumber); 
                   for (var y=lownumber; y <= highnumber; y++){
                      newOrderPack.images.push(imageUploadInfos[y-1]);
                   } 
                    
                    newOrderPack.save(function(err) {
                        if (err){
                          console.log('No se pudo guardar el paquete del pedido: '+ err); 
                        }
                        else
                        {
                          //console.log(' Se guardó el paquete ' + y + ' del pedido');
                          //console.log(newOrderPack); 
                        }
                    });
                   lownumber = lownumber + packagelenght;
                   highnumber = highnumber + packagelenght;     

            }
            if (otherfiles > 0){
                highnumber = lownumber + (otherfiles-1);
                //console.log(lownumber + ', ' + highnumber);
                var newOrderPack = new OrderPacks();
                newOrderPack.status = newOrder.status;  
                newOrderPack.userid = newOrder.userid;
                newOrderPack.numorder = newOrder.numorder;
                newOrderPack.specid = newOrderSpec._id;
                newOrderPack.name = 'Package ' + (numpacksfull + 1);
                newOrderPack.userid = newOrder.userid;
                newOrderPack.date = Date();
                newOrderPack.imagecount = (highnumber - lownumber) + 1;
               for (var y=lownumber; y <= highnumber; y++){
                  newOrderPack.images.push(imageUploadInfos[y-1]);
               } 
                newOrderPack.save(function(err) {
                    if (err){
                      console.log('No se pudo guardar el paquete ' + y +' del pedido: '+ err); 
                    }
                    else
                    {
                      //console.log(' Se guardó el paquete' + y + ' del pedido'); 
                      //console.log(newOrderPack);
                    }
                });
               
            }
              //res.write('<h1>'+ numorderstr + '</h1>');
              //res.end();
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 0, message: 'Se guardó el pedido', numorder: newOrder.numorder, typespec: spec[0].typespec })); 
            }
          });  
        }
      } 
    });
  }
  catch(err) {
    //console.log(err.message);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el pedido'})); 
  }
});

  router.get('/',
  function(req, res) {
    res.render('intro', {message: req.flash('message')});
    //res.sendFile('../public/htmls/intro.html' , { root : __dirname});
    //console.log(req.user);
  });

// router.get('/imagen',
//   function(req, res) {
//     //res.render('intro', {message: req.flash('message')});
//     //res.download('../public/images/boton_play1.png');
//     console.log(path.resolve(__dirname));
//       res.attachment(path.join(__dirname, '../public/htmls', 'micuenta.bak' ));

//     res.attachment(path.join(__dirname, '../public/htmls', 'thankyou.bak' ));
//     res.end();
//     //console.log(req.user);
//   });

/* GET como page. */
  router.get('/como', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('como', {message: req.flash('message')});
  });

  router.get('/contacto', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('contacto', {message: req.flash('message')});
  });

  router.get('/registro', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('registro', {message: req.flash('message')});
  });

  router.get('/de_registro', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('de_registro', {message: req.flash('message')});
  });

  router.get('/faq', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('faq', {message: req.flash('message')});
  });

  router.get('/como2', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('como2', {message: req.flash('message')});
  });


  router.get('/precios', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('precios', {message: req.flash('message'), precio:config.prices.cutandremove});
  });

 router.get('/de_packages', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('de_packages', {message: req.flash('message')});
  });

 router.get('/de_package_get/:packageid', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('de_package_get', {packageid: req.params.packageid});
  });

 router.get('/de_package_review/:packageid', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('de_package_review', {packageid: req.params.packageid});
  });

 router.get('/downloadimages/:numorder', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('downloadimages', {numorder: req.params.numorder, countorders:ordersinproc});
  });


  router.get('/de_uploadimages/:packageid', 
     //require('connect-ensure-login').ensureLoggedIn('/de_login'),
         function(req, res){

            OrderPacks.find({'_id':req.params.packageid },function(err, OrderPack) {
                // In case of any error return
                //console.log(OrderPack);
                 if (err){
                   console.log('Error al consultar ' + err);
                 }
                 //console.log("prueba 2");
               // already exists
                if (OrderPack.length > 0) {
                  //console.log(OrderPack);
                  //console.log(OrderPack[0].numorder);
                  //console.log('Cantidad:' + OrderPack[0].imagecount);

                  findaorder(OrderPack[0].numorder,function(error,order){
                     //console.log(order);

                      findanyorderspec(order[0].specid,function(error,spec){
                                //console.log(spec);
                             res.render('de_uploadimages', {message: req.flash('message'), numorder: OrderPack[0].numorder, user: req.user, packname:OrderPack[0].name ,userid: OrderPack[0].userid, imagecount:OrderPack[0].imagecount, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , config:config, order:order[0], orderpackid:OrderPack[0]._id, S3_BUCKET_NAME_DONE:S3_BUCKET_NAME_DONE});
                       
                       });
                     //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
                     //res.render('confirmpayorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0],  config:config, countorders:ordersinproc});             
                      // res.setHeader('Content-Type', 'application/json');
                      // res.send(order); 
                  });
                } 
                else {
                  console.log('No se encontraron paquetes de pedidos');
                }
               
              });




     
  });
  
 router.get('/hinewuser', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('hinewuser', {message: req.flash('message')});
  });

/* GET login page. */
  router.get('/login', function(req, res) {
    //console.log(req.flash('message'));
   
    //res.render('login', {message: 'dfjhdjhsjd'});
    var msjres = req.flash('message');
    res.render('login', {message: msjres[0]});

  });
//Login para diseñadores
  router.get('/de_login', function(req, res) {
    res.render('de_login', {message: req.flash('message')});
  });
 
  router.get('/logout',
  function(req, res){
     
     //res.redirect('https://www.facebook.com/logout.php?next=localhost:3000/&access_token='+passport.accessToken);
     req.logOut();
     req.session.destroy();
     res.clearCookie('connect.sid');

     setTimeout(function() {
        res.redirect("/");
     }, 1000);
  });

/* Maneja la página micuenta */
  router.get('/micuenta', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('micuenta', {message: req.flash('message'), user: req.user, countorders:ordersinproc});
  });


/* Maneja la página especificaciones1 */
  router.get('/especificaciones1', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){

          countorders(req.user._id,function(count){
               
              //res.render('historial', {message: req.flash('message'), user: req.user, countorders:count });
              res.render('especificaciones1', {message: req.flash('message'), user: req.user, countorders:count});
          });

          
  });

  /* Maneja la página especificaciones2 */
  router.get('/especificaciones2', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('especificaciones2', {message: req.flash('message'), user: req.user, config:config, countorders:ordersinproc, specid:''});
  });

router.get('/de_designers', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('de_designers', {message: req.flash('message'), user: req.user, config:config});
  });


/* Maneja la confirmación de un usuario */
  router.get('/confirmuser/:userid',function(req, res) {
    doConfirmUser(req.params.userid, function(err, message){
         res.render('login', {message: message});
    });      
  });

/* Maneja la página especificaciones2 cuando se va a editar una especificación */
  router.get('/especificaciones2/:specid', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('especificaciones2', {message: req.flash('message'), user: req.user, config:config, countorders:ordersinproc, specid:req.params.specid});
  });

/* Maneja la página de_especificaciones2 cuando se va a editar una especificación */
  router.get('/de_especificaciones2/:specid', 
     require('connect-ensure-login').ensureLoggedIn('/de_login'),
         function(req, res){
           res.render('de_especificaciones2', {message: req.flash('message'), user: req.user, config:config, countorders:ordersinproc, specid:req.params.specid});
  });

  /* Maneja la aplicación principal */
  router.get('/principal', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          //console.log(req.user);
          

          countorders(req.user._id,function(count){
            // Validar si el usuario tiene .
               res.render('principal', {message: req.flash('message'), user: req.user, countorders:count});
 
          });
 });

 

/* Maneja la página historial */
  router.get('/historial', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){

           countorders(req.user._id,function(count){
               //console.log(count);
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
              // res.render('confirmpayorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0]});             
              //res.render('principal', {message: req.flash('message'), user: req.user, countorders:count});
              res.render('historial', {message: req.flash('message'), user: req.user, countorders:count });
          });
           
  });


/* Maneja la pagina donde se escoge la tecnica para subir imagenes */
  router.get('/subirimagen1', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
               countorders(req.user._id,function(count){
               res.render('subirimagen1', {message: req.flash('message'), user: req.user, countorders:count });
          });
  });


/* Maneja la pagina que tiene el dropzone para subir imágenes */
  router.get('/chooseanimage', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
            countorders(req.user._id,function(count){
               res.render('chooseanimage', {message: req.flash('message'), user: req.user, countorders:count });
           });
  });

/* Maneja la pagina para seleccionar el tamaño de las imágenes */
  router.get('/chooseasize', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('chooseasize', {message: req.flash('message'), user: req.user, countorders:ordersinproc});
  });

/* Maneja la pagina para seleccionar el margen las imágenes */
  router.get('/chooseamargin', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('chooseamargin', {message: req.flash('message'), user: req.user, countorders:ordersinproc});
  });

  /* Maneja la pagina para seleccionar la alineación de las imágenes */
  router.get('/chooseanalignment', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('chooseanalignment', {message: req.flash('message'), user: req.user,countorders:ordersinproc});
  });

/* Maneja la pagina que permite elegir un extra de la especificación */
  router.get('/chooseanextra', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('chooseanextra', {message: req.flash('message'), user: req.user, config:config, countorders:ordersinproc});
  });


/* Maneja la pagina que tiene el dropzone para subir imágenes */
  router.get('/uploadimages', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('uploadimages', {message: req.flash('message'), user: req.user, config:config, countorders:ordersinproc, S3_BUCKET_NAME:S3_BUCKET_NAME});
  });

/* Maneja la pagina que tiene el dropzone para subir imágenes 
   Cuando es llamada desde la creación de una especificación
*/
  router.get('/uploadimages/:newSpecid', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
            findaspec(req.params.newSpecid,function(error,spec){
              //console.log(spec);
              res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , config:config, countorders:ordersinproc, S3_BUCKET_NAME:S3_BUCKET_NAME});
            });
  });


  

  /* Maneja la pagina que tiene el dropzone para subir imágenes 
   Cuando es llamada desde la creación de una especificación
*/
  router.get('/getSpec/:specid/:disabled', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          //console.log(req.params.disabled)
          var disabled = (req.params.disabled === 'true');
          //console.log(disabled)
            findaspecfull(req.params.specid,disabled,function(error,message,spec){
              //console.log(spec);
              //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
              
              if (error===0){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: message, spec: spec[0]})); 
              }
              else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: message})); 
              }
              
            });
  });

  router.get('/getOrdeSpec/:specid', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          //console.log(req.params.disabled)
          var disabled = (req.params.disabled === 'true');
          //console.log(disabled)
            findanyorderspec(req.params.specid,function(error,spec){
              //console.log(spec);
              //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
              
              if (error===0){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: 'No se pudo encontrar la especificación', spec: spec[0]})); 
              }
              else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: 'Se encontró la especificación del pedido'})); 
              }
              
            });
  });
  router.get('/getUser_details/:userid', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
            findauser_details(req.params.userid,function(error,message,user_details){
              //console.log(spec);
              //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
              
              if (error===0){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: message, user_details: user_details[0]})); 
              }
              else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: error, message: message})); 
              }
              
            });
  });
/* Maneja la pagina donde se cierra el pedido o la orden de compra */
  router.get('/chooseaspecification', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('chooseaspecification', {message: req.flash('message'), user: req.user, countorders:ordersinproc});
  });

/* Maneja la pagina donde se cierra el pedido o la orden de compra */
  // router.get('/subirimagen3/:numorder', 
  //    require('connect-ensure-login').ensureLoggedIn('/login'),
  //        function(req, res){
  //          console.log(req.params);
  //          res.render('subirimagen3', {message: req.flash('message'), user: req.user, numorder:req.params.numorder});
  // });

/* Maneja la pagina donde se paga el pedido o la orden de compra */
  router.get('/confirmpayorder/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          findaorder(req.params.numorder,function(error,order){
               //console.log(order);
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               res.render('confirmpayorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0],  config:config, countorders:ordersinproc});             
          });
  });

 router.get('/findaorder/:numorder', 
     //require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          findaorder(req.params.numorder,function(error,order){
               //console.log(order);
               res.setHeader('Content-Type', 'application/json');
               res.send(JSON.stringify({ order:order[0].numorder, specid: order[0].specid, imagecount:order[0].imagecount, images:order[0].images, userid: order[0].userid}));
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               //res.render('confirmpayorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0],  config:config, countorders:ordersinproc});             
          });
  });
  router.get('/thankyou/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          findaorder(req.params.numorder,function(error,order){
               //console.log(order);
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               res.render('thankyou', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0], countorders:ordersinproc});             
          });
  });

 router.get('/denytransaction/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          findaorder(req.params.numorder,function(error,order){
               //console.log(order);
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               res.render('denytransaction', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order[0], countorders:ordersinproc});             
          });
  });

 router.get('/error/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          findaorder(req.params.numorder,function(error,order){
               //console.log(order);
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               res.render('error', {message: 'No se pudo completar la orden', user: req.user, numorder:req.params.numorder, order:order[0], countorders:ordersinproc});             
          });
  });

 router.get('/error', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               res.render('error', {message: 'Ha ocurrido un error inesperado', user: req.user, numorder:0, order:0, countorders:ordersinproc});             
      
  });

  router.get('/receipt/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          User_details
          .findOne({userid:req.user._id})
          .populate('userid')
          .exec(function(err,user_details){

            if (err){
              res.render('receipt', {message: '¡Lo sentimos!, No se encontró el número de recibo', user:req.user, numorder:0, countorders:ordersinproc});            
            } 
            else if (user_details){


              Orders
              .findOne({numorder:req.params.numorder})
              .populate('specid', 'totalprice')
              .exec(function(err,order){

              
              //findaorder(req.params.numorder,function(error,order){
                 //console.log(order);
                 //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
                 res.render('receipt', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order, countorders:ordersinproc, user_details:user_details});             
              });

            }
            else
            {
              res.render('receipt', {message: '¡Lo sentimos!, No se encontró el número de recibo', user:req.user, numorder:0, countorders:ordersinproc});            
            }
          });  

          
  });

 router.get('/payorder/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               //var numorder_zero = fillzero(req.params.numorder, '0000000');

               res.render('payorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, countorders:ordersinproc});             
         
  });
 router.get('/cancelorder/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          
               //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
               //var numorder_zero = fillzero(req.params.numorder, '0000000');

               res.render('cancelorder', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, countorders:ordersinproc});             
         
  });
// router.get('/uploadimages/:newSpecid', 
//      require('connect-ensure-login').ensureLoggedIn('/login'),
//          function(req, res){
//             findaspec(req.params.newSpecid,function(error,spec){
//               //console.log(spec);
//               res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
//             });
//   });

  /* Handle Login POST */
  router.post('/signin', passport.authenticate('login', {
    successRedirect: '/principal',
    failureRedirect: '/login',
    failureFlash : true,
    successFlash : true 
  }));
 
   /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/signup_success',
    failureRedirect: '/signup_error',
    failureFlash : true, 
    successFlash : true 
  }));
  
  /* Handle Designer Login POST */
 router.post('/de_signin', passport.authenticate('de_login', {
    successRedirect: '/de_designers',
    failureRedirect: '/de_login',
    failureFlash : true,
    successFlash : true 
  }));
 
   /* Handle Designer Registration POST */
  router.post('/de_signup', passport.authenticate('de_signup', {
    successRedirect: '/de_signup_success',
    failureRedirect: '/de_signup_error',
    failureFlash : true, 
    successFlash : true 
  }));


  /* maneja si el registro fue exitoso */
  // router.get('/signup_success', function(req, res) {
  //   var msjres = req.flash('success');
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ error: 0, message: msjres[0]}));
  // });



 router.get('/signup_success', require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res){
        var msjres = req.flash('success');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ error: 0, message: msjres[0]}));
  });




  // Si sucede un error al registrar un usuario se ejecuta esta ruta
  router.get('/signup_error', function(req, res) {
    var msjres = req.flash('error');
    if (msjres[0]!= undefined){
         //console.log(msjres[0]);
         res.setHeader('Content-Type', 'application/json');
         res.send(JSON.stringify({ error: 1, message: msjres[0]}));
    }
    else {
         res.redirect('/');
    }
  });

  router.get('/de_signup_success', require('connect-ensure-login').ensureLoggedIn('/de_login'),
    function(req, res){
        var msjres = req.flash('success');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ error: 0, message: msjres[0]}));
  });




  // Si sucede un error al registrar un usuario se ejecuta esta ruta
  router.get('/de_signup_error', function(req, res) {
    var msjres = req.flash('error');
    if (msjres[0]!= undefined){
         //console.log(msjres[0]);
         res.setHeader('Content-Type', 'application/json');
         res.send(JSON.stringify({ error: 1, message: msjres[0]}));
    }
    else {
         res.redirect('/');
    }
  });



// /newstepspec


// CRUD
/* Handle new step by step specification  POST */
  router.post('/newstepspec', function (req,res) {
    // body...
      var specInfos = JSON.parse(req.body['specInfos']);
      var newSpec = new Spec();
      // set the user's local credentials
      // recibir el array de datos
      newSpec.name = specInfos[0].specname;
      newSpec.format = specInfos[0].format;
      newSpec.format_ext = specInfos[0].format;
      if(specInfos[0].format==='jpg_web'){newSpec.format_ext = 'jpg'}
      if(specInfos[0].format==='tiff'){newSpec.format_ext = 'tif'}
      newSpec.colormode = specInfos[0].colormode;
      newSpec.background = specInfos[0].background;
      newSpec.backgrndcolor = specInfos[0].backgrndcolor;
      newSpec.dpi = specInfos[0].DPI;
      newSpec.dpinone = specInfos[0].dpinone;
      newSpec.userid = req.user._id;  
      newSpec.alignnone = specInfos[0].alignnone;
      newSpec.alignhor = specInfos[0].alignhor;
      newSpec.alignver = specInfos[0].alignver;
      newSpec.imagesize = specInfos[0].imagesize;
      newSpec.sizenone = specInfos[0].sizenone;
      newSpec.measuresize = specInfos[0].measuresize;
      newSpec.marginnone = specInfos[0].marginnone;
      newSpec.marginmeasure = specInfos[0].marginmeasure;
      newSpec.margintop = specInfos[0].margintop; //??
      newSpec.marginbottom = specInfos[0].marginbottom; //??
      newSpec.marginright = specInfos[0].marginright; //??
      newSpec.marginleft = specInfos[0].marginleft; //??
      newSpec.naturalshadow = specInfos[0].naturalshadow;
      newSpec.dropshadow = specInfos[0].dropshadow;
      newSpec.correctcolor = specInfos[0].correctcolor;
      newSpec.clippingpath = specInfos[0].clippingpath;
      newSpec.basicretouch = specInfos[0].basicretouch;
      newSpec.widthsize = specInfos[0].widthsize;
      newSpec.heightsize = specInfos[0].heightsize;
      newSpec.spectype = specInfos[0].spectype;
      newSpec.date = specInfos[0].date;

      // pasar el req specInfo
      spectotalprice(specInfos[0],function(total,totalMXN){
          //console.log(total);
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 0, ntotal:total , message: 'Se guardó la especificación'})); 
          newSpec.totalprice = total;
          newSpec.totalpriceMXN = totalMXN;
          // save the user
          newSpec.save(function(err) {
            if (err){
              console.log('No se pudo guardar la especificación: ' + err); 
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar la especificación'})); 
              throw err;  
            }
            //console.log('Se guardó correctamente la especificación');

            Spec.find({'userid': newSpec.userid ,'typespec':'free', 'disabled':false},function(err, specrecord) {
               // already exists
                if (specrecord.length > 0) {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, freeSpecid: specrecord[0]._id, newSpecid: newSpec._id, message: 'Se guardó correctamente la especificación'})); 
                } 
                else {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, newSpecid: newSpec._id, message: 'Se guardó correctamente la especificación'})); 
                }
              }).select('_id').limit(1);
          });
    });
  });



router.post('/updateuserdetails', require('connect-ensure-login').ensureLoggedIn('/login'),
    function(req, res){
    
  // body...
    //var user_details_id = req.body.specid;
    var newUserDet = new User_details();
      // set the user's local credentials
      //newSpec.specid = req.body.specid;
    newUserDet.userid = req.user._id;
    newUserDet.contactname = req.body.contactname;
    newUserDet.contactemail = req.body.contactemail;
    newUserDet.sel_contactcountry = req.body.sel_contactcountry;
    newUserDet.chk_factura = req.body.chk_factura;
    newUserDet.factrfc = req.body.factrfc;
    newUserDet.sel_factcountry = req.body.sel_factcountry;
    newUserDet.factmunicipio = req.body.factmunicipio;
    newUserDet.factcolonia = req.body.factcolonia;
    newUserDet.factnum_ext = req.body.factnum_ext;
    newUserDet.factcp = req.body.factcp;
    newUserDet.factpaymethod = req.body.factpaymethod;
    newUserDet.factrazonsocial = req.body.factrazonsocial;
    newUserDet.factestado = req.body.factestado;
    newUserDet.factciudad = req.body.factciudad;
    newUserDet.factcalle = req.body.factcalle;
    newUserDet.factnum_int = req.body.factnum_int;
    newUserDet.factemail2 = req.body.factemail2;
    newUserDet.factterminacion = req.body.factterminacion;
    User_details.findOne({ userid: req.user._id}, function (err, doc){
        //console.log(req.body.name);
        //console.log(err);
        if (err){
            console.log('Se presentó un problema al buscar los detalles del usuario: '+err);
            //res.setHeader('Content-Type', 'application/json');
            //res.send(JSON.stringify({ error: 1, newSpecid: newSpec._id, message: 'No se guardaron los cambios, favor de contactar al administrador'})); 
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ error: 1, newUserDet: newUserDet._id, message: 'No se pudieron guardar los cambios, favor de contactar al administrador'}));
        }
        else{
          if (doc) {

            doc.userid=  req.user._id;
            doc.contactname =  req.body.contactname;
            doc.contactemail =  req.body.contactemail;
            doc.sel_contactcountry =  req.body.sel_contactcountry;
            doc.chk_factura =  req.body.chk_factura;
            doc.factrfc =  req.body.factrfc;
            doc.sel_factcountry = req.body.sel_factcountry;
            doc.factmunicipio = req.body.factmunicipio;
            doc.factcolonia = req.body.factcolonia;
            doc.factnum_ext = req.body.factnum_ext;
            doc.factcp = req.body.factcp;
            doc.factpaymethod = req.body.factpaymethod;
            doc.factrazonsocial = req.body.factrazonsocial;
            doc.factestado = req.body.factestado;
            doc.factciudad = req.body.factciudad;
            doc.factcalle = req.body.factcalle;
            doc.factnum_int = req.body.factnum_int;
            doc.factemail2 = req.body.factemail2;
            doc.factterminacion = req.body.factterminacion;
            //doc.specid = req.user.specid;
            //console.log(doc);
            doc.save( function(err){
               if (err){
                  //newSpec.save();
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, newUserDet: newUserDet._id, message: 'No se guardaron correctamente los detalles del usuario'})); 
               }
               else{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, newUserDet: newUserDet._id, message: 'Se guardaron correctamente los detalles del usuario'})); 
               }
            });
          } 
          else {
            ///guardar
              newUserDet.save(function(err) {
                if (err){
                  console.log('No se pudo guardar los detalles del usuario: ' + err); 
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar los detalles del usuario'})); 
                  //throw err;  
                }
                else{
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, newUserDet: newUserDet._id, message: 'Se guardó correctamente los detalles del usuario'})); 
                }
              });

             
          }

          
        }

      });


});
   


 /* Handle new specification POST */
  router.post('/newspec', function (req,res) {
    // body...
    //console.log(req.body);

    //console.log(req.user._id);
    
    //console.log(req.body.specid);
    var specid = req.body.specid;
      var newSpec = new Spec();
      // set the user's local credentials
      //newSpec.specid = req.body.specid;
      newSpec.name = req.body.name;
      newSpec.format = req.body.format;
      newSpec.format_ext = req.body.format;
      if(req.body.format==='jpg_web'){newSpec.format_ext = 'jpg'}
      if(req.body.format==='tiff'){newSpec.format_ext = 'tif'}
      newSpec.colormode = req.body.colormode;
      newSpec.background = req.body.background;
      newSpec.backgrndcolor = req.body.backgrndcolor;
      newSpec.dpi = req.body.DPI;
      newSpec.dpinone = req.body.dpinone;
      newSpec.userid = req.user._id;  
      newSpec.alignnone = req.body.alignnone;
      newSpec.alignhor = req.body.alignhor;
      newSpec.alignver = req.body.alignver;
      newSpec.sizenone = req.body.sizenone;
      newSpec.imagesize = req.body.imagesize;
      newSpec.marginnone = req.body.marginnone;
      newSpec.marginmeasure = req.body.marginmeasure;
      newSpec.measuresize = req.body.measuresize;
      newSpec.margintop = req.body.margintop;
      newSpec.marginbottom = req.body.marginbottom;
      newSpec.marginright = req.body.marginright;
      newSpec.marginleft = req.body.marginleft;
      newSpec.naturalshadow = req.body.naturalshadow;
      newSpec.dropshadow = req.body.dropshadow;
      newSpec.correctcolor = req.body.correctcolor;
      newSpec.clippingpath = req.body.clippingpath;
      newSpec.basicretouch = req.body.basicretouch;
      newSpec.widthsize = req.body.widthsize;
      newSpec.heightsize = req.body.heightsize;
      newSpec.spectype = req.body.spectype;
      newSpec.date = req.body.date;
      spectotalprice(req.body,function(total, totalMXN){
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 0, ntotal:total , message: 'Se guardó la especificación'})); 
          newSpec.totalprice = total;
          newSpec.totalpriceMXN = totalMXN;
          // guarda los cambios de una especificacion
          if (specid === null || specid === ''){
            // crea una nueva especificacion
            newSpec.save(function(err) {
                if (err){
                  console.log('No se pudo guardar la especificación: ' + err); 
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar la especificación'})); 
                  throw err;  
                }
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ error: 0, newSpecid: newSpec._id, message: 'Se generó correctamente la especificación'})); 
              });
          }else{
            //console.log('Update');
            //console.log(specid);
            Spec.findOne({ _id: specid, typespec:'normal'  }, function (err, doc){
              //console.log(req.body.name);
              //console.log(err);
              if (err){
                  console.log('Error al guardar la especificación: '+err);
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 1, newSpecid: newSpec._id, message: 'No se guardaron los cambios, favor de contactar al administrador'})); 
              }
              else{
                if (doc) {
                  doc.name = req.body.name;
                  doc.format = req.body.format;
                  doc.format_ext = req.body.format;
                  if(req.body.format==='jpg_web'){doc.format_ext = 'jpg'}
                  if(req.body.format==='tiff'){doc.format_ext = 'tif'}
                  doc.colormode = req.body.colormode;
                  doc.background = req.body.background;
                  doc.backgrndcolor = req.body.backgrndcolor;
                  doc.dpi = req.body.DPI;
                  doc.dpinone = req.body.dpinone;
                  //doc.userid = req.user._id;  
                  doc.alignnone = req.body.alignnone;
                  doc.alignhor = req.body.alignhor;
                  doc.alignver = req.body.alignver;
                  doc.sizenone = req.body.sizenone;
                  doc.imagesize = req.body.imagesize;
                  doc.marginnone = req.body.marginnone;
                  doc.marginmeasure = req.body.marginmeasure;
                  doc.measuresize = req.body.measuresize;
                  doc.margintop = req.body.margintop;
                  doc.marginbottom = req.body.marginbottom;
                  doc.marginright = req.body.marginright;
                  doc.marginleft = req.body.marginleft;
                  doc.naturalshadow = req.body.naturalshadow;
                  doc.dropshadow = req.body.dropshadow;
                  doc.correctcolor = req.body.correctcolor;
                  doc.clippingpath = req.body.clippingpath;
                  doc.basicretouch = req.body.basicretouch;
                  doc.widthsize = req.body.widthsize;
                  doc.heightsize = req.body.heightsize;
                  doc.spectype = req.body.spectype;
                  doc.date = req.body.date;
                  doc.totalprice = newSpec.totalprice;
                  doc.totalpriceMXN = newSpec.totalpriceMXN;

                  //doc.specid = req.user.specid;
                  //console.log(doc);

                  doc.save();
                  
                  //newSpec.save();
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 0, newSpecid: specid, message: 'Se guardaron correctamente los cambios a la especificación'})); 
                } 
                else {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(JSON.stringify({ error: 1, newSpecid: specid, message: 'No se encontró la especificación, los cambios no fueron almacenados'})); 
                }
              }
            });  
          }
    });
  });

/* Handle get payment sign POST */
  router.post('/getpaymentsign/:numorder', function (req,res) {
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ error: error, message: message, user_details: user_details[0]})); 
    findaorder(req.params.numorder,function(err,order){
      if (err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 1, message:'No se encontró el pedido', sign: ''})); 
      }
      else{
          //console.log(order);
          var CSSB = process.env.CSSB || '5634ytyertewrg';
          var paymentsign = '';

          var totalpayPesos = order[0].totalpay  * parseFloat(config.prices.dollar);
          totalpayPesos = setDecimals (totalpayPesos,2);
          //console.log(totalpayPesos); 
          var Ds_Merchant_Amount = totalpayPesos.toString().replace('.', ''); //req.param('Ds_Merchant_Amount');
          var Ds_Merchant_Order = fillzero(req.params.numorder, '0000000');
          var Ds_Merchant_MerchantCode = 4093847; //req.param('Ds_Merchant_MerchantCode');
          var Ds_Merchant_Currency = 484; // 484 pesos 840 Dólar req.param('Ds_Merchant_Currency');
          var Ds_Merchant_TransactionType  = 0; //req.param('Ds_Merchant_TransactionType');
          var Ds_Merchant_UrlOK = 'https://www.imgnpro.com/transactionok';
          var Ds_Merchant_UrlKO = 'https://www.imgnpro.com/transactiondeny';
          var Ds_Merchant_MerchantURL = 'https://www.imgnpro.com';
          var Ds_Merchant_MerchantName = 'IMAGEN PRO';
          var Ds_Merchant_Terminal = 1;
          var Ds_Merchant_ProductDescription = order[0].imagecount + ' IMÁGEN(ES)';
          //console.log('A pagar:' + Ds_Merchant_Amount);
          //console.log('Pedido:' + Ds_Merchant_Order);
          //console.log('Codigo comercio:' + Ds_Merchant_MerchantCode);
          //console.log('Moneda:' + Ds_Merchant_Currency);
          //console.log('Tipo transacción:' + Ds_Merchant_TransactionType);




          paymentsign = sha1(Ds_Merchant_Amount + Ds_Merchant_Order + Ds_Merchant_MerchantCode + Ds_Merchant_Currency + Ds_Merchant_TransactionType + CSSB);
          //console.log(paymentsign);

             //SHA-1()
                 
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 0, Ds_Merchant_MerchantSignature: paymentsign, Ds_Merchant_Amount:Ds_Merchant_Amount, Ds_Merchant_Order:Ds_Merchant_Order, Ds_Merchant_UrlOK:Ds_Merchant_UrlOK, Ds_Merchant_UrlKO:Ds_Merchant_UrlKO, Ds_Merchant_MerchantURL:Ds_Merchant_MerchantURL, Ds_Merchant_MerchantCode:Ds_Merchant_MerchantCode, Ds_Merchant_Currency:Ds_Merchant_Currency, Ds_Merchant_TransactionType:Ds_Merchant_TransactionType, Ds_Merchant_MerchantName:Ds_Merchant_MerchantName, Ds_Merchant_Terminal:Ds_Merchant_Terminal, Ds_Merchant_ProductDescription:Ds_Merchant_ProductDescription})); 
        }
    });        
  });

  router.post('/getcancelsign/:numorder', function (req,res) {
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ error: error, message: message, user_details: user_details[0]})); 
    findaorder(req.params.numorder,function(err,order){
      if (err){
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 1, message:'No se encontró el pedido', sign: ''})); 
      }
      else{
          //console.log(order);
          var CSSB = process.env.CSSB || '5634ytyertewrg';
          var paymentsign = '';

          var totalpayPesos = order[0].totalpay  * parseFloat(config.prices.dollar);
          totalpayPesos = setDecimals (totalpayPesos,2);
          //console.log(totalpayPesos); 
          var Ds_Merchant_Amount = totalpayPesos.toString().replace('.', ''); //req.param('Ds_Merchant_Amount');
          var Ds_Merchant_Order = fillzero(req.params.numorder, '0000000');
          var Ds_Merchant_MerchantCode = 4093847; //req.param('Ds_Merchant_MerchantCode');
          var Ds_Merchant_Currency = 484; // 484 pesos 840 Dólar req.param('Ds_Merchant_Currency');
          var Ds_Merchant_TransactionType  = 4; //req.param('Ds_Merchant_TransactionType');
          var Ds_Merchant_UrlOK = 'https://www.imgnpro.com/transactionok';
          var Ds_Merchant_UrlKO = 'https://www.imgnpro.com/transactiondeny';
          var Ds_Merchant_MerchantURL = 'https://www.imgnpro.com';
          var Ds_Merchant_MerchantName = 'IMAGEN PRO';
          var Ds_Merchant_Terminal = 1;
          var Ds_Merchant_ProductDescription = order[0].imagecount + ' IMÁGEN(ES)';
          //console.log('A pagar:' + Ds_Merchant_Amount);
          //console.log('Pedido:' + Ds_Merchant_Order);
          //console.log('Codigo comercio:' + Ds_Merchant_MerchantCode);
          //console.log('Moneda:' + Ds_Merchant_Currency);
          //console.log('Tipo transacción:' + Ds_Merchant_TransactionType);




          paymentsign = sha1(Ds_Merchant_Amount + Ds_Merchant_Order + Ds_Merchant_MerchantCode + Ds_Merchant_Currency + Ds_Merchant_TransactionType + CSSB);
          //console.log(paymentsign);

             //SHA-1()
                 
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 0, Ds_Merchant_MerchantSignature: paymentsign, Ds_Merchant_Amount:Ds_Merchant_Amount, Ds_Merchant_Order:Ds_Merchant_Order, Ds_Merchant_UrlOK:Ds_Merchant_UrlOK, Ds_Merchant_UrlKO:Ds_Merchant_UrlKO, Ds_Merchant_MerchantURL:Ds_Merchant_MerchantURL, Ds_Merchant_MerchantCode:Ds_Merchant_MerchantCode, Ds_Merchant_Currency:Ds_Merchant_Currency, Ds_Merchant_TransactionType:Ds_Merchant_TransactionType, Ds_Merchant_MerchantName:Ds_Merchant_MerchantName, Ds_Merchant_Terminal:Ds_Merchant_Terminal, Ds_Merchant_ProductDescription:Ds_Merchant_ProductDescription})); 
        }
    });        
  });
  /* Handle Registration POST */
  // router.post('/signuplocal', passport.authenticate('signup', {
  //   successRedirect: '/reslocal',
  //   failureRedirect: '/signuplocal',
  //   failureFlash : true,
  //   successFlash : true 
  // }));

// Passport local

// Define routes.
// router.get('/',
//   function(req, res) {
//     res.render('index', { user: req.user });
//     //console.log(req.user);
//   });

//res.sendFile(__dirname + '/indexAgent.html');





router.get('/uploadfile',
  function(req, res) {
    res.render('uploadfile', { user: req.user });
  });

// router.get('/paypal',
//   function(req, res) {
//     res.render('paypal', { user: req.user });
//   });


// router.get('/login',
//   function(req, res){
//     res.render('login');
//   });

 // /* GET Registration Page */
  // router.get('/signup', function(req, res){
  //   console.log("get signup");
  //   res.render('registerlocal',{ message: req.flash('message')});
  // });
 

router.get('/login/facebook',
  passport.authenticate('facebook'));


// router.get('/login/facebook/return', 
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/principal');
//     console.log (req);
//   });


 // router.get('/signin', passport.authenticate('login', {
 //    successRedirect: '/principal',
 //    failureRedirect: '/login',
 //    failureFlash : true,
 //    successFlash : true 
 //  }));
 

router.get('/login/facebook/return', 
  passport.authenticate('facebook', { 
    successRedirect: '/principal',
    failureRedirect: '/login',
    failureFlash : true,
    successFlash : true 
  }));

 
  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails
  router.get('/login/google', passport.authenticate('google', 
    { scope : ['profile', 'email'] }
    )
  );

  // the callback after google has authenticated the user
  router.get('/login/google/return',
          passport.authenticate('google', {
          successRedirect : '/principal',
          failureRedirect : '/login',
          failureFlash : true,
          successFlash : true 
  }));



router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */

router.get('/delete-s3', (req, res) => {
  const s3 = new aws.S3();
  //console.log(req.query['filename']);
  const fileName = req.user._id +'/' + req.query['filename']; 
  var params = {
    Bucket: S3_BUCKET_NAME, /* required */
    Key: fileName /* required */
    //MFA: 'STRING_VALUE',
    //RequestPayer: 'requester',
    //VersionId: 'STRING_VALUE'
  };
  s3.deleteObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); 
      var returnData = {
        error: 1,
        message: `Error al borrar`
      };
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(returnData));
      res.end();
    
    }// an error occurred
    else{     
      //console.log(data);           // successful response
      var returnData = {
          error: 0,
          message: `se borró`
        };
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(returnData));
        res.end();
        }
      });
});

router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  // el nombre del folder llevar el id del usuario
  var folder = req.user._id +'/' ;
  // crea la carpeta para guardar las imágenes
  var params = { Bucket: S3_BUCKET_NAME, Key: folder, ACL: 'public-read', Body:'body does not matter' };
  s3.upload(params, function (err, data) {
  if (err) {
      console.log("Error creating the folder: ", err);
      } else {
      //console.log("Successfully created a folder on S3");
      }
  });
  // crea la carpeta para guardar las vistas en miniatura de las imágenes
  var params = { Bucket: S3_BUCKET_NAME_THUMB, Key: folder, ACL: 'public-read', Body:'body does not matter' };
  s3.upload(params, function (err, data) {
  if (err) {
      console.log("Error creating the folder thumbnail: ", err);
      } else {
      //console.log("Successfully created a thumbnail folder on S3");

      }
  });
  // al fileName se le agrega el folder para que la firma lo reconozca
  const fileName = req.user._id +'/' + req.query['filename'];
  const fileType = req.query['filetype'];
  // const s3Params = {
  //   Bucket: S3_BUCKET_NAME,
  //   Key: fileName,
  //   Expires: 10000,
  //   ContentType: fileType,
  //   ACL: 'public-read'
  // };
  var policy = require('s3-policy');
  var p = policy({
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    length: 200000000,
    bucket: S3_BUCKET_NAME,
    key: fileName,
    ContentType: fileType,
    expires: new Date(Date.now() + 60000),
    acl: 'public-read'
  });
  //console.log(p.policy);
  //console.log(p.signature);
  var result = {
    AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    key: fileName,
    policy: p.policy,
    signature: p.signature,
    url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
  };
  //console.log(result);
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(result));
  res.end();

  // s3.getSignedUrl('putObject', s3Params, (err, data) => {
  //   if(err){
  //     console.log("error");
  //     return res.end();
  //   }
  //   const returnData = {
  //     signedRequest: data,
  //     url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
  //   };
  //   console.log(returnData);
  //   res.write(JSON.stringify(returnData));
  //   res.end();
  // });
});


router.get('/sign-s3get', (req, res) => {
        const s3 = new aws.S3();
        const fileName = req.query['userid'] +'/' + req.query['filename'];
        //console.log('File:' + fileName);
        const s3Params = {Bucket: S3_BUCKET_NAME, Key: fileName, Expires: 100000};
        const s3Paramsthumb = {Bucket: S3_BUCKET_NAME_THUMB, Key: fileName, Expires: 100000};

      var urlthumb = s3.getSignedUrl('getObject', s3Paramsthumb);

      s3.getSignedUrl('getObject', s3Params, function (err, data) {
        //console.log("The URL is", url);
          if(err){
            console.log("error");
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({}));
            return res.end();
          }
          const returnData = {
            signedRequest: data,
            signedthumbRequest: urlthumb
            //url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
          };
          //console.log(returnData);
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(returnData));
          res.end();

      });
});


router.get('/sign-s3down', (req, res) => {
        const s3 = new aws.S3();
        const fileName = req.query['userid'] +'/' + req.query['filename'];
        //console.log('File:' + fileName);
        const s3Params = {Bucket: S3_BUCKET_NAME_DONE, Key: fileName, Expires: 100000};
        //const s3Paramsthumb = {Bucket: S3_BUCKET_NAME_THUMB, Key: fileName, Expires: 100000};

      //var urlthumb = s3.getSignedUrl('getObject', s3Paramsthumb);

      s3.getSignedUrl('getObject', s3Params, function (err, data) {
        //console.log("The URL is", url);
          if(err){
            console.log("error");
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify({}));
            return res.end();
          }
          const returnData = {
            signedRequest: data
            //signedthumbRequest: urlthumb
            //url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
          };
          //console.log(returnData);
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(returnData));
          res.end();

      });
});

router.get('/sign-s3review', (req, res) => {
      const s3 = new aws.S3();
      
      var sFname = req.query['filename'];
      var sFext = sFname.match(/\.([^.]*)$/);
      var sFNameComp = "";
      //console.log(sFext);
      var returnData = {};
      if(sFext){
        sFNameComp = sFname.substring(0, sFname.length - sFext[1].length );
        //console.log('archivo subido por el diseñador:' + sFNameComp);
      }else{
        console.log("error");

        returnData = {
            error: 1
            //url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
          };
        res.setHeader('Content-Type', 'application/json');  
        res.write(JSON.stringify(returnData));
        //res.write(JSON.stringify({err:2,message:'El archivo no tiene extensión'}));
        return res.end();
     }
    OrderPacks
    .findOne({'_id': req.query['orderpackid']})
    .populate('specid','format_ext')
    .exec(function(err,OrderPack){

      //console.log('OrderPack');
      //console.log(OrderPack);
      //console.log("SpecID: " + OrderPack.specid.format_ext);
      //console.log(sFext);

        sFNameComp = sFNameComp + OrderPack.specid.format_ext;
        const fileName = req.query['userid'] +'/' + sFNameComp;
        //console.log('File:' + fileName);
        const s3Params = {Bucket: S3_BUCKET_NAME_DONE, Key: fileName, Expires: 100000};
        const s3Paramsthumb = {Bucket: S3_BUCKET_NAME_THUMB, Key: fileName, Expires: 100000};

      var urlthumb = s3.getSignedUrl('getObject', s3Paramsthumb);
      s3.getSignedUrl('getObject', s3Params, function (err, data) {
        //console.log("The URL is", url);
          if(err){
            console.log("error");
            returnData = {
              signedthumbRequest: urlthumb
              //url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
            };
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(returnData));
            return res.end();
          }

          returnData = {
            signedRequest: data,
            signedthumbRequest: urlthumb,
            signedFileName: sFNameComp
            //url: `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
          };
          //console.log(returnData);
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(returnData));
          res.end();

      });

    });
      



});

// se pide un key para borrar un archivo terminado
router.get('/delete-s3done', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['userid']  +'/' + req.query['filename']; 
  var params = {
    Bucket: S3_BUCKET_NAME_DONE, /* required */
    Key: fileName /* required */
    //MFA: 'STRING_VALUE',
    //RequestPayer: 'requester',
    //VersionId: 'STRING_VALUE'
  };


  s3.deleteObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); 
      var returnData = {
        error: 1,
        message: `Error al borrar`
      };
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(returnData));
      res.end();
    
    }// an error occurred
    else{     
      //console.log(data);           // successful response
      var returnData = {
          error: 0,
          message: `se borró`
        };
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(returnData));
        res.end();
        }
      });
});

// Para solicitar una llave para que el diseñador suba un archivo terminado

router.get('/sign-s3done', (req, res) => {
  const s3 = new aws.S3();
  // el nombre del folder llevar el id del usuario
  var folder = req.query['userid'] +'/' ;
  // crea la carpeta para guardar las imágenes
  var params = { Bucket: S3_BUCKET_NAME_DONE, Key: folder, ACL: 'public-read', Body:'body does not matter' };
  
  var sFname = req.query['filename'];
  var sFext = sFname.match(/\.([^.]*)$/);
  var sFNameComp = "";
  //console.log(sFext);

  if(sFext){
    sFNameComp = sFname.substring(0, sFname.length - sFext[1].length );
    //console.log('archivo subido por el diseñador:' + sFNameComp);
  }else{
    console.log("error");
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({err:2,message:'El archivo no tiene extensión'}));
    return res.end();
 }
  OrderPacks
  .findOne({'_id': req.query['orderpackid']})
  .populate('specid','format_ext')
  .exec(function(err,OrderPack){
    //console.log('OrderPack');
    //console.log(OrderPack);
    //console.log("SpecID: " + OrderPack.specid.format_ext);
    //console.log(sFext);

    if(OrderPack.specid.format_ext == "tif" && (sFext[1] != 'tiff' && sFext[1] != 'tif')  ){
        //console.log('1');
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({err:2, message:'La extensión o el tipo del archivo no coincide con la especificación'}));
        return res.end();
    }
    
    if (OrderPack.specid.format_ext == "tif" && sFext[1] == 'tiff'){
        sFext[1] = 'tif' ;
    }

//console.log(sFext[1] !== 'zip');
//console.log(sFext[1] != 'zip');
    // if(sFext[1] != OrderPack.specid.format_ext  && sFext[1] != 'zip'){
    //         res.write(JSON.stringify({err:2, message:'La extensión o el tipo del archivo no coincide con la especificación'}));
    //         return res.end();
    // }

    
    var orderpackimgs = OrderPack.images;
    var b_findimg = false;
    //console.log(orderpackimgs[0].imagename);
     
    var sFnameU = "";
    var sFNameCompU = ""; 
    for(var i=0;i < OrderPack.images.length; i++ ){


     //console.log(OrderPack.images[i].imagename);
     
     sFnameU = OrderPack.images[i].imagename;
     var sFextU = sFnameU.match(/\.([^.]*)$/);
     //console.log(sFextU);

      if(sFextU){
        sFNameCompU = sFnameU.substring(0, sFnameU.length - sFextU[1].length );
       
      }else{
        sFNameCompU = sFnameU;
     }
      //console.log('archivo subido usuario:' + sFNameCompU);

      //if(OrderPack.images[i].imagename == req.query['filename'] ){
      if(sFNameCompU == sFNameComp ){
        //console.log('Se econtró archivo');
        b_findimg = true;
        break;
      }
       
    }
    if (b_findimg == true){
      s3.upload(params, function (err, data) {
      if (err) {
          console.log("Error al crear la carpeta de trabajos terminados: ", err);
          } else {
          //console.log("Successfully created a folder on S3");

          }
      });

      // al fileName se le agrega el folder para que la firma lo reconozca
      var fileName = req.query['userid'] + '/' + req.query['filename'];
      var fileType = req.query['filetype'];

      if (sFext[1] == 'zip'){
        fileName = req.query['userid'] + '/' +  sFNameCompU + '.' + sFext[1];
      }
      
      const s3Params = {
        Bucket: S3_BUCKET_NAME_DONE,
        Key: fileName,
        Expires: 10000,
        ContentType: fileType,
        ACL: 'public-read'
      };


      var policy = require('s3-policy');
       
      var p = policy({
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        length: 200000000,
        bucket: S3_BUCKET_NAME_DONE,
        key: fileName,
        ContentType: fileType,
        expires: new Date(Date.now() + 60000),
        acl: 'public-read'
      });
       
 // };
      //console.log(p.policy);
      //console.log(p.signature);
      var result = {
        AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        key: fileName,
        policy: p.policy,
        signature: p.signature,
        url: `https://${S3_BUCKET_NAME_DONE}.s3.amazonaws.com/${fileName}`
      };

      //console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(result));
        res.end();



      // s3.getSignedUrl('putObject', s3Params, (err, data) => {
      //   if(err){
      //     console.log("error");
      //     res.write(JSON.stringify({err:2,message:'No se pudo obtener una firma'}));
      //     return res.end();
      //   }
      //   const returnData = {
      //     signedRequest: data,
      //     url: `https://${S3_BUCKET_NAME_DONE}.s3.amazonaws.com/${fileName}`
      //   };
      //   console.log(returnData);
      //   res.write(JSON.stringify(returnData));
      //   res.end();
      // });

    }else{
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify({err:1, message:' Imagen no válida'}));
      return res.end();
    }

  });



});


router.post('/transactionok', function (req,res) {
  //console.log(req.params);
  doConfirmPayOrder(req,function(tipomsg, message,href){
    //res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify({ error: tipomsg, message: message, href:href}));
    if (tipomsg == 1){
      res.redirect('/error.html/' + req.params.Ds_Order); 
    }
    else{
      res.redirect('/' + href+ '/' + req.params.Ds_Order); 
    }
    
  });
                 
});


/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
router.post('/save-details', (req, res) => {
  // TODO: Read POSTed form data and do something useful
});
    // cutandremove:1.50,
    // naturalshadow:0.55,
    // dropshadow:0.20,
    // correctcolor:0.40,
    // clippingpath:2.40,
    // basicretouch:0.60

function spectotalprice(req, cb){
  
  // se agrega a nTotal el costo mínimo 

  //console.log(req.param('background'));
  //console.log(req); 
  //console.log(parseFloat(req.body.naturalshadow));
  // se multiplica por 100 para quitar los decimales y evitar errores de precision
  var nTotal = (config.prices.cutandremove) * 100;
  var ntotalMXN = 0;
  if (parseFloat(req.naturalshadow ) > 0){
    nTotal = nTotal + (config.prices.naturalshadow * 100);
  }
  if (parseFloat(req.dropshadow) > 0){
    nTotal = nTotal + (config.prices.dropshadow * 100);
  }
  if (parseFloat(req.correctcolor) > 0){
    nTotal = nTotal + (config.prices.correctcolor * 100);
  }
  if (parseFloat(req.clippingpath)> 0){
    nTotal = nTotal + (config.prices.clippingpath * 100);
  }
  if (parseFloat(req.basicretouch) >0){
    nTotal = nTotal + (config.prices.basicretouch * 100);
  }
  nTotal = nTotal / 100;
  ntotalMXN = nTotal * parseFloat(config.prices.dollar);
  cb(nTotal, ntotalMXN);
}


function findaspec(specid, cb){
  Spec.find({'_id':specid, 'disabled':false},function(err, specrecord) {
    // In case of any error return
     if (err){
       console.log('Error al consultar la especificación');

      cb(1);
     }
   // already exists
    if (specrecord.length > 0) {
      //console.log('se encontró  la especificación');
      //console.log(specrecord);
      cb( 0, specrecord);
    } 
    else {
      console.log('No se encontró la especificación');
        cb(2);
    }
   
  }).select('name totalprice totalpriceMXN date maxfiles typespec').limit(1);
}

// function findanyspec(specid, cb){
//   console.log(specid);
//   Spec.find({'_id':specid},function(err, specrecord) {
//     // In case of any error return
//      if (err){
//        console.log('Error al consultar la especificación');

//       cb(1);
//      }
//    // already exists
//     if (specrecord) {
//       console.log('se encontró  la especificación');
//       console.log(specrecord);
//       cb( 0, specrecord);
//     } 
//     else {
//       console.log('No se encontró la especificación');
//         cb(2);
//     }
   
//   }).select('name totalprice totalpriceMXN date maxfiles typespec').limit(1);
// }

function findanyorderspec(specid, cb){
  //console.log(specid);
  OrderSpec.find({'_id':specid},function(err, specrecord) {
    // In case of any error return
     if (err){
       console.log('Error al consultar la especificación');

      cb(1);
     }
   // already exists
    if (specrecord.length > 0) {
      //console.log('se encontró  la especificación');
      //console.log(specrecord);
      cb( 0, specrecord);
    } 
    else {
      console.log('No se encontró la especificación');
        cb(2);
    }
   
  }).limit(1);
}

function findaspecfull(specid, disabled, cb){
  if (specid.length === 0){
    cb(1, 'Error al consultar la especificación, longitud 0');
  }
  else{
      var params = {'_id':specid, 'disabled': disabled};
      if(disabled){
        params = {'_id':specid}
      }
      Spec.find(params,function(err, specrecord) {
      // In case of any error return
       if (err){
         console.log('Error al consultar la especificación');

        cb(1, 'Error al consultar la especificación' + err);
       }
       else{
    // already exists
          if (specrecord.length > 0) {
            //console.log('Se encontró  la especificación');
            //console.log(specrecord);
            cb( 0,'Se encontró  la especificación', specrecord);
          } 
          else {
            console.log('No se encontró la especificación');
              cb(2,'No se encontró  la especificación' );
          }
       }
    }).limit(1);
  }
}

function findauser_details(userid, cb){
  if (userid.length === 0){
    cb(1, 'Error al consultar los detalles del usuario, longitud 0');
  }
  else{
      User_details.find({'userid':userid},function(err, userrecord) {
      // In case of any error return
       if (err){
         console.log('Error al consultar los detalles del usuario');

        cb(1, 'Error al consultar los detalles del usuario');
       }
       else{
    // already exists
          if (userrecord.length > 0) {
            //console.log('Se encontraron los detalles del usuario');
            //console.log(userrecord);
            cb( 0,'Se encontraron los detalles del usuario', userrecord);
          } 
          else {
            console.log('No se encontraron los detalles del usuario');
              cb(2,'No se encontraron los detalles del usuario' );
          }
       }
    }).limit(1);
  }
}

function findauser(userid, cb){
  if (userid.length === 0){
    cb(1, 'Error al consultar al usuario, longitud 0');
  }
  else{
      //console.log(userid);
      User.find({'_id':userid},function(err, user) {
      // In case of any error return
       if (err){
         console.log('Error al consultar el usuario');

        cb(1, 'Error al consultar el usuario');
       }
       else{
    // already exists
          if (user.length > 0) {
            //console.log('Se encontró el usuario');
            //console.log(user);
            cb( 0,'Se encontró el usuario', user);
          } 
          else {
            console.log('No se encontró el usuario');
              cb(2,'No se encontró el usuario' );
          }
       }
    }).limit(1);
  }
}

function findaorder(orderid, cb){
  //console.log(orderid);
  Orders.find({'numorder':orderid},function(err, orderrecord) {
    // In case of any error return
     if (err){
       console.log('Error al consultar el pedido');

      cb(1);
     }
     //console.log("prueba 2");
   // already exists
    if (orderrecord.length > 0) {
      //console.log('Se encontró  el pedido');
      //console.log(orderrecord);
      //res.setHeader('Content-Type', 'application/json');
      //res.send(orders); 

      cb( 0, orderrecord);

    } 
    else {
      console.log('No se encontró el pedido');

        cb(2);
    }
  }).select('date status totalpay totalpayMXN specid imagecount images userid').limit(1);
}

function doConfirmOrder(numorder,req,typespec,cb){
  //console.log(req.user);
  findauser(req.user._id,function(error,message,user){
      //console.log(spec);
      //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
      
      if (error){
        cb( 1,'No se encontró el usuario');
      }
      else
      {
        //console.log('error:' + error);
       //console.log('user: ');
       //console.log(user);

        var statusorder ='';
       
        if (user[0].usertype=='business' || typespec=='free' ){
            statusorder ='En Proceso';
            href = 'thankyou';


        }
        else
        {
           statusorder ='Por pagar';
            href = 'payorder';
        }
        //console.log(user);
        //console.log(statusorder);

        //confirmar pedido y paquetes

        if (statusorder =='En Proceso'){
          var conditions = { numorder: numorder }
            , update = { $set: { status: statusorder }}
            , options = { multi: true };
          findaorder(numorder,function(err,order){
            User_details.findOne({userid:req.user._id},function(err,user_details){
              if (err){
                console.log(err);
              } 
              else{
                  if(user_details.chk_factura == 'chk_factura'){
                    var mailOptions = {
                      from: '"Server" <server@mail-imgnpro.com>', // sender address
                      to: 'makeacfdi@mail-imgnpro.com, jerh56@gmail.com', // list of receivers
                      subject: 'Factura', // Subject line
                      text: '', // plaintext body
                      //html: '<a href="www.imgnpro.com/confirmuser"</a>' // html body
                      html: '<html>' + 'Hola, el nombre de mi empresa es ' + user_details.factrazonsocial +
                      '<br><b> Necesito una factura electrónica</b><br>' + 'Mis datos son los siguientes:<br> <b>' + 
                      'Razón social:' + user_details.factrazonsocial + '<br>' +
                      'RFC:' + user_details.factrfc + '<br>' +
                      'Domicilio:' + user_details.factcalle + ',' + 
                                     user_details.factcolonia + ',' + 
                                     user_details.factnum_ext + ',' +
                                     user_details.factnum_int + ',' +
                                     user_details.factmunicipio + ',' +
                                     user_details.factciudad + ',' +
                                     user_details.factestado + ',' +
                                     user_details.sel_factcountry + ',' + '<br>' +
                      'Número de pedido:' + numorder + '<br>' +
                      'Monto total: USD ' + order[0].totalpay + '<br>' +
                      'Monto total: MXN ' + order[0].totalpayMXN + '<br>' +
                      'Estatus del pedido: ' + statusorder + '<br>' +
                      'Método de pago:' + user_details.factpaymethod + '<br>' +
                      'Terminación de la tarjeta:' + user_details.factterminacion + '<br>' +
                      'e-mail:  <span>' + user_details.factemail2 + '</span><br></b></html>'  // html body
                    };
                    //console.log(mailOptions);
                    //send mail with defined transport object
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        //console.log('Message sent: ' + info.response);
                    });
                  }
              } 
            });          
          }); 
          Orders.update(conditions, update, options, function (err, numAffected) {
            // numAffected is the number of updated documents
           
            //console.log(numAffected);
            if (err){
                console.log(err);
                cb( 1,'No fue posible actualizar el estatus del pedido');
            }
            else{
                // actualizar paquetes

                OrderPacks.update(conditions, update, options, function (err, numAffected) {
                  // numAffected is the number of updated documents
                 
                  //console.log(numAffected);
                  if (err){
                      console.log(err);
                      cb( 1,'No fue posible actualizar el estatus del pedido');
                  }
                  else{
                      // actualizar paquetes
                      cb( 0,'Se actualizó el estatus del pedido', href);

                  }
                });
                //cb( 0,'Se actualizó el estatus del pedido', href);

            }
          });

        }
        else
        {
            cb( 2,'Pedido normal', href);
        }
          

      }
    });
}


function doConfirmPayOrder(req,cb){
  var Ds_Response = req.params.Ds_Response;
  var numorder = req.params.Ds_Order;
  numorder = numorder.replace(/0/g, ''); // quita los ceros del pedido
  //console.log(req.user);
  //findauser(req.user._id,function(error,message,user){
      //console.log(spec);
      //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id , countorders:ordersinproc});
      
      // if (error){
      //   cb( 1,'No se encontró el usuario');
      // }
      // else
      // {
        //console.log('error:' + error);
       //console.log('user: ');
       //console.log(user);

    var newOrder_transaction = new Order_transaction();
      // set the user's local credentials
      //newSpec.specid = req.body.specid;
    //newOrder_transaction.userid = req.user._id;
    
    newOrder_transaction.numorder = req.params.numorder;
    newOrder_transaction.Ds_Amount = req.params.Ds_Amount;
    newOrder_transaction.Ds_Currency = req.params.Ds_Currency;
    newOrder_transaction.Ds_Order= req.params.Ds_Order;
    newOrder_transaction.Ds_MerchantCode = req.params.Ds_MerchantCode;
    newOrder_transaction.Ds_Terminal = req.params.Ds_Terminal;
    newOrder_transaction.Ds_Signature = req.params.Ds_Signature;
    newOrder_transaction.Ds_Response = req.params.Ds_Response;
    newOrder_transaction.Ds_MerchantData = req.params.Ds_MerchantData;
    newOrder_transaction.Ds_SecurePayment = req.params.Ds_SecurePayment;
    newOrder_transaction.Ds_TransactionType = req.params.Ds_TransactionType;
    newOrder_transaction.Ds_ConsumerLanguage = req.params.Ds_ConsumerLanguage;
    newOrder_transaction.Ds_ErrorCode = req.params.Ds_ErrorCode;
    newOrder_transaction.Ds_ErrorMessage = req.params.Ds_ErrorMessage;

    newOrder_transaction.save(function(err) {
          if (err){
              console.log('No se pudo guardar la transacción del pedido: '+ req.params.numorder +' '+err); 
          }
          else{
            //console.log('Se guardó la transacción del pedido:' + req.params.numorder); 
          }
     });     

        var statusorder ='';
       
        if (Ds_Response=='000' ){
            statusorder ='En Proceso';
            href = 'thankyou';


        }
        else
        {
           statusorder ='Por pagar';
            href = 'denytransaction';
        }
        //console.log(user);
        //console.log(statusorder);

        //confirmar pedido y paquetes

        if (statusorder =='En Proceso'){
          var conditions = { numorder: numorder }
            , update = { $set: { status: statusorder }}
            , options = { multi: true };
          findaorder(numorder,function(err,order){
            User_details.findOne({userid:req.user._id},function(err,user_details){
              if (err){
                console.log(err);
              } 
              else{
                  if(user_details.chk_factura == 'chk_factura'){
                    var mailOptions = {
                      from: '"Server" <server@mail-imgnpro.com>', // sender address
                      to: 'makeacfdi@mail-imgnpro.com, jerh56@gmail.com', // list of receivers
                      subject: 'Factura', // Subject line
                      text: '', // plaintext body
                      //html: '<a href="www.imgnpro.com/confirmuser"</a>' // html body
                      html: '<html>' + 'Hola, el nombre de mi empresa es ' + user_details.factrazonsocial +
                      '<br><b> Necesito una factura electrónica</b><br>' + 'Mis datos son los siguientes:<br> <b>' + 
                      'Razón social:' + user_details.factrazonsocial + '<br>' +
                      'RFC:' + user_details.factrfc + '<br>' +
                      'Domicilio:' + user_details.factcalle + ',' + 
                                     user_details.factcolonia + ',' + 
                                     user_details.factnum_ext + ',' +
                                     user_details.factnum_int + ',' +
                                     user_details.factmunicipio + ',' +
                                     user_details.factciudad + ',' +
                                     user_details.factestado + ',' +
                                     user_details.sel_factcountry + ',' + '<br>' +
                      'Número de pedido:' + numorder + '<br>' +
                      'Monto total: USD ' + order[0].totalpay + '<br>' +
                      'Monto total: MXN ' + order[0].totalpayMXN + '<br>' +
                      'Estatus del pedido: ' + statusorder + '<br>' +
                      'Método de pago:' + user_details.factpaymethod + '<br>' +
                      'Terminación de la tarjeta:' + user_details.factterminacion + '<br>' +
                      'e-mail:  <span>' + user_details.factemail2 + '</span><br></b></html>'  // html body
                    };
                    //console.log(mailOptions);
                    //send mail with defined transport object
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        //console.log('Message sent: ' + info.response);
                    });
                  }
              } 
            });          
          }); 


          Orders.update(conditions, update, options, function (err, numAffected) {
            // numAffected is the number of updated documents
           
            //console.log(numAffected);
            if (err){
                console.log(err);
                cb( 1,'No fue posible actualizar el estatus del pedido');
            }
            else{
                // actualizar paquetes

                OrderPacks.update(conditions, update, options, function (err, numAffected) {
                  // numAffected is the number of updated documents
                 
                  //console.log(numAffected);
                  if (err){
                      console.log(err);
                      cb( 1,'No fue posible actualizar el estatus del pedido');
                  }
                  else{
                      // actualizar paquetes
                      cb( 0,'Transacción autorizada', href);

                  }
                });
                //cb( 0,'Se actualizó el estatus del pedido', href);

            }
          });

        }
        else
        {
            cb( 2,'Transacción denegada', href);
        }
          

      //}
    //});
}



router.get('/testorder', function (req,res) {
    //console.log('testorder');
    Orders.findOne({ numorder: 17}, function (err, doc){

    console.log(err);
    if (err){
        console.log('Error : '+err);
        res.write(JSON.stringify({err:1, message:' Error'}));
        res.end();

    }
    else{
      
      if (doc) {
        //doc.disabled = false;
       
        //doc.specid = req.user.specid;
        //console.log(doc);
        //console.log(doc.images[0].push('position1', 'ooo'));
        doc.images[0].de_imagename= 'paptito.jpg';
        //doc.images[0].deimagename= 'paptito.jpg';
        console.log(doc);
        // doc.save(function(err){
        //     console.log(result)
        // });
        //doc.save();

        doc.save(function(err, result){
             console.log(result);
             console.log(err);
        res.write(JSON.stringify({err:1, message:' Se guardo'}));
        res.end();
         });
        
      }else{
        res.write(JSON.stringify({err:1, message:' Error'}));
        res.end();
      }
      
    }  

  });
});    






function countorders(userid,cb){

  Orders.count({'userid':userid, 'status':'En Proceso'}, function( err, count){
    //console.log(userid);
    //console.log( "Número de pedidos:", count );
    //req.countorders = count;
    ordersinproc = count;
    cb(count);
  });

}

function toDateString(date,cb){
  var dateformat = '';
  dateformat = String('00' + date.getDate()).slice(-2) + '/' + String('00' + date.getMonth()).slice(-2)+ '/' + date.getFullYear();
  cd(dateformat);
}

function doConfirmUser(userid,cb){
 //var confirmUser = new User();

  //console.log('Confirm user');
  //console.log(userid);
  User.findOne({ _id: userid  }, function (err, doc){

    //console.log(err);
    if (err){
        console.log('Error al confimar usuario: '+err);
        cb(1,'Error al confimar usuario: '+err);
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 1, message: 'No se guardaron los cambios, favor de contactar al administrador'})); 
    }
    else{
      if (doc) {
        doc.disabled = false;
       
        //doc.specid = req.user.specid;
        //console.log(doc);

        doc.save();
        cb(0,'usuario confirmado, favor de ingresar');
        //newSpec.save();
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 0,  message: 'Se guardaron correctamente los cambios a la especificación'})); 
      } 
      else {
        cb(1,'No se encontró al usuario');
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 1,  message: 'No se encontró la especificación, los cambios no fueron almacenados'})); 
      }
    }
  });  
}

function disableSpec(specid,cb){
    //console.log(specid);
    Spec.findOne({ _id: specid, typespec:'free'  }, function (err, doc){
      //console.log(req.body.name);
      //console.log(err);
      if (err){
          console.log('Error al guardar la especificación: '+err);
          //res.setHeader('Content-Type', 'application/json');
          //res.send(JSON.stringify({ error: 1, newSpecid: newSpec._id, message: 'No se guardaron los cambios, favor de contactar al administrador'})); 
          cb(1,'Error al guardar la especificación: '+err);
      }
      else{
        if (doc) {
          
          doc.disabled = true;
          //doc.specid = req.user.specid;
          //console.log(doc);

          doc.save();
          cb(0,'Error al guardar la especificación: '+err);
          //newSpec.save();
          //res.setHeader('Content-Type', 'application/json');
          //res.send(JSON.stringify({ error: 0, newSpecid: newSpec._id, message: 'Se guardaron correctamente los cambios a la especificación'})); 
        } 
        else {
          cb(1,'No se encontró la especificación, los cambios no fueron almacenados');
          //res.setHeader('Content-Type', 'application/json');
          //res.send(JSON.stringify({ error: 1, newSpecid: newSpec._id, message: 'No se encontró la especificación, los cambios no fueron almacenados'})); 
        }
      }
    });  
}

function fillzero(param,pattern){
  return (pattern + param).slice(-7);

}

function setDecimals(sVal, nDec){ 
  var n = parseFloat(sVal); 
  var s = "0.00"; 
  if (!isNaN(n)){ 
   n = Math.round(n * Math.pow(10, nDec)) / Math.pow(10, nDec); 
   s = String(n); 
   s += (s.indexOf(".") == -1? ".": "") + String(Math.pow(10, nDec)).substr(1); 
   s = s.substr(0, s.indexOf(".") + nDec + 1); 
  } 
  return s; 
}

module.exports = router;
