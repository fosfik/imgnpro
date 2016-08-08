var express = require('express');
var aws = require('aws-sdk');
var router = express.Router();
var multer = require('multer');
//var cloudinary = require('cloudinary');
var passport = require('passport');
var sha1 = require('sha1');
//var passport = require('passport-local');
//var Strategy = require('passport-facebook').Strategy;
var config = require('../config');
var path = require('path');
var Orderstest = require('../models/order.js');
var Spec = require('../models/specification.js');
var Contact = require('../models/contact.js');


// TODO agregar seguridad a esta ruta
router.get('/listorders', function(req, res) {
  Orderstest.find({'userid':req.user._id},function(err, orders) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (orders) {
      console.log('se encontraron pedidos');
      res.setHeader('Content-Type', 'application/json');
      res.send(orders); 

    } 
    else {
      console.log('No se encontraron pedidos');
    }
   
  }).select('imagecount numorder status date');
});
 
// TODO agregar seguridad a esta ruta
router.get('/listspecs', function(req, res) {
  Spec.find({'userid':req.user._id},function(err, specs) {
    // In case of any error return
     if (err){
       console.log('Error al consultar');
     }
     //console.log("prueba 2");
   // already exists
    if (specs) {
      console.log('se encontraron especificaciones');
      res.setHeader('Content-Type', 'application/json');
      res.send(specs); 
    } 
    else {
      console.log('No se encontraron pedidos');
    }
  }).select('name date');
});

/* Crea un nuevo contacto. */
  router.post('/newcontact', function(req, res) {
    console.log(req.body);
    var newContact = new Contact();
    newContact.name = req.body['name'];
    newContact.email = req.body['email'];
    newContact.message = req.body['message'];
    newContact.save(function(err) {
      if (err){
          console.log('No se pudo guardar el pedido: '+err);  
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el contacto'})); 
      }
      else{
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ error: 0, message: 'Se guardó el contacto'})); 
      }
    });  
  });
 


/* Crea un nuevo pedido. */
  router.post('/neworder', function(req, res) {
    // Display the Login page with any flash message, if any
   // todo: modificar este try catch
   try {
    console.log(req.body['imageUploadInfos']);
    //console.log(req.params);
    var numorderstr="";
    var newOrder = new Orderstest();
          newOrder.name = 'orderfotos';
          newOrder.userid = req.user._id;
          newOrder.imagecount = req.body['imagecount'];
          // todo: recorrer el req.body para obtener los datos de las imagenes
          



    var imageUploadInfos = JSON.parse(req.body['imageUploadInfos']);
    console.log(imageUploadInfos);

          for (var i=0; i < imageUploadInfos.length; i++){
              //i === 0: arr[0] === undefined;
              //i === 1: arr[1] === 'hola';
              //i === 2: arr[2] === 'chau';
              console.log(imageUploadInfos[i]);
            newOrder.images.push(imageUploadInfos[i]);

          }

           // save the user
          newOrder.save(function(err) {
            if (err){
              console.log(newOrder);
              console.log(newOrder.images);
              console.log('No se pudo guardar el pedido: '+err); 
              //res.render('como2', {message: req.flash('message')}); 
              //throw err;  
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar el pedido'})); 


            }
            else
            {

              console.log(' se guardo el pedido'); 
              console.log(newOrder.numorder);
              // res.render('como2', {message: req.flash('message')});
              numorderstr = String(newOrder.numorder);
              console.log(numorderstr);
              

              //res.write('<h1>'+ numorderstr + '</h1>');
              //res.end();
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 0, message: 'Se guardó el pedido', numorder: newOrder.numorder})); 


            }

        });  
}
catch(err) {
   
   console.log(err.message);
}
          // newOrder.images.push({imagename:"https://s3.amazonaws/imagen.jpg", width:300});
          // newOrder.images.push({imagename:"https://s3.amazonaws/imagen.jpg", width:300});
          // newOrder.images.push({imagename:"https://s3.amazonaws/imagen.jpg", width:300});
          // newOrder.images.push({imagename:"https://s3.amazonaws/imagen.jpg", width:300});

          
          
         
    //res.set('Content-Type', 'application/javascript');
    //res.render('ordertest', {numorder: numorderstr });


  });
 

 // router.get('/neworder',
 //  function(req, res) {

 //  });



      


//var flash = require('connect-flash'); // middleware para mensajes en passport

//app.use(flash());



/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

// PASSPORT

// router.get('*',function(req,res){  
//     res.redirect('https://imgnpro.com'+req.url)
// });

  router.get('/',
  function(req, res) {
    res.render('intro', {message: req.flash('message')});
    //res.sendFile('../public/htmls/intro.html' , { root : __dirname});
    //console.log(req.user);
  });


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
    res.render('precios', {message: req.flash('message')});
  });
/* GET login page. */
  router.get('/login', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('login', {message: req.flash('message')});
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


// Passport local 


  /* Maneja la aplicación micuenta */
  // router.get('/micuenta', 
  //    require('connect-ensure-login').ensureLoggedIn('/login'),
  //        function(req, res){

  //         var newOrder = new Orders();
  //         // set the user's local credentials
  //         newOrder.useremail = 'userlongname';
          
          
  //         // save the user
  //         newOrder.save(function(err) {
  //           if (err){
  //             console.log('No se pudo guardar el pedido: '+err);  
  //             throw err;  
  //           }
  //           console.log('Se registró correctamente el pedido ' + newOrder.useremail );    
  //         });
  //          res.render('micuenta', {message: req.flash('message'), user: req.user});
  // });


/* Maneja la página micuenta */
  router.get('/micuenta', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('micuenta', {message: req.flash('message'), user: req.user});
  });


/* Maneja la página especificaciones1 */
  router.get('/especificaciones1', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('especificaciones1', {message: req.flash('message'), user: req.user});
  });

  /* Maneja la página especificaciones2 */
  router.get('/especificaciones2', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('especificaciones2', {message: req.flash('message'), user: req.user});
  });

  /* Maneja la aplicación principal */
  router.get('/principal', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
          console.log(req.user);
           res.render('principal', {message: req.flash('message'), user: req.user});
  });

/* Maneja la página historial */
  router.get('/historial', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('historial', {message: req.flash('message'), user: req.user});
  });


/* Maneja la pagina donde se escoge la tecnica para subir imagenes */
  router.get('/subirimagen1', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('subirimagen1', {message: req.flash('message'), user: req.user});
  });


/* Maneja la pagina que tiene el dropzone para subir imágenes */
  router.get('/subirimagen2', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('subirimagen2', {message: req.flash('message'), user: req.user});
  });

/* Maneja la pagina donde se cierra el pedido o la orden de compra */
  router.get('/subirimagen3', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           res.render('subirimagen3', {message: req.flash('message'), user: req.user});
  });

/* Maneja la pagina donde se cierra el pedido o la orden de compra */
  router.get('/subirimagen3/:numorder', 
     require('connect-ensure-login').ensureLoggedIn('/login'),
         function(req, res){
           console.log(req.params);
           res.render('subirimagen3', {message: req.flash('message'), user: req.user, numorder:req.params.numorder});
  });

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
         console.log(msjres[0]);
         res.setHeader('Content-Type', 'application/json');
         res.send(JSON.stringify({ error: 1, message: msjres[0]}));
    }
    else {
         res.redirect('/');
    }
  });

 /* Handle new specification POST */
  router.post('/newspec', function (req,res) {
    // body...
    //console.log(req);
    console.log(req.param('background'));
    console.log(req.param('name'));
    console.log(req.param('colormode'));
    console.log(req.param('format'));
    console.log(req.param('dpi'));
    console.log(req.param('numorder'));

    console.log(req.user._id);

     var newSpec = new Spec();
          // set the user's local credentials
          newSpec.name = req.param('name');
          newSpec.format = req.param('format');
          newSpec.colormode = req.param('colormode');
          newSpec.background = req.param('background');
          newSpec.dpi = req.param('dpi');
          newSpec.userid = req.user._id; 
          newSpec.specid = '0'; 
        
          // save the user
          newSpec.save(function(err) {
            if (err){
              console.log('No se pudo guardar la especificación: ' + err); 
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar la especificación'})); 
              throw err;  
            }
            console.log('Se guardó correctamente la especificación');
            console.log(newSpec._id);

            Orderstest.findOneAndUpdate({numorder: req.param('numorder')}, {$set: { specid: newSpec._id } },{upsert:true, new: true}, function(error, Order)   {
                if(error){
                  //throw err;
                  console.log(error);
                }
                else {
                  console.log("Se actualizó el pedido");
                } 
                
            }); 


// orderSchema.pre('save', function(next) {
//     var doc = this;
//     counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} },{upsert:true, new: true}, function(error, counter)   {
//         if(error)
//             return next(error);
//         doc.numorder = counter.seq;
//         next();
//     }); 
// });
//             findOneAndUpdate(
//     {_id: req.query.id},
//     {$push: {items: item}},
//     {safe: true, upsert: true},
//     function(err, model) {
//         console.log(err);
//     }    
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ error: 0, message: 'Se guardó la especificación'})); 
              
          });
  });


/* Handle get payment sign POST */
  router.post('/getpaymentsign', function (req,res) {
   
    var secretkey = 'trgy4y55664dgf'; 
    var paymentsign = '';
    var Ds_Merchant_Amount = req.param('Ds_Merchant_Amount');
    var Ds_Merchant_Order = req.param('Ds_Merchant_Order');
    var Ds_Merchant_MerchantCode = req.param('Ds_Merchant_MerchantCode');
    var Ds_Merchant_Currency = req.param('Ds_Merchant_Currency');
    var Ds_Merchant_TransactionType  = req.param('Ds_Merchant_TransactionType');
    paymentsign = sha1(Ds_Merchant_Amount + Ds_Merchant_Order + Ds_Merchant_MerchantCode + Ds_Merchant_Currency + Ds_Merchant_TransactionType + secretkey);
    console.log(paymentsign);

 //SHA-1()
           
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ error: 0, sign: paymentsign})); 
              
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


router.get('/login/facebook/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
    console.log (req);
  });


router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

//var upload = multer({ dest: 'uploads/' });



const S3_BUCKET = process.env.S3_BUCKET_NAME;



/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
router.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['filename'];
  const fileType = req.query['filetype'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 10000,
    ContentType: fileType,
    ACL: 'public-read'
  };
  console.log(fileName);
  console.log(fileType);
   console.log(s3Params);
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log("error");
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
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




// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

// app.set("view engine", "jade");
// app.use(express.static("public"));


// cloudinary.config({ 
//   cloud_name: config.cloudinary.cloud_name, 
//   api_key: config.cloudinary.api_key, 
//   api_secret: config.cloudinary.api_secret 
// });

// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, 'public/uploads/');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname + '-' + Date.now());
//   }
// });
 

//  var type = multer({ storage : storage}).single('photoimage');


// router.post('/upload', type, function (req,res) {

//   /** When using the "single"
//       data come in "req.file" regardless of the attribute "name". **/
//   var tmp_path = req.file.path;
//   console.log(tmp_path);
//   cloudinary.uploader.upload(req.file.path, function(result) { 
//      console.log(result) 
//      //res.render("index");
//      res.render('photo', {file : result});
//      //res.send(result);
//   });

// });






module.exports = router;
