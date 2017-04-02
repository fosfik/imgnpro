//var express = require('express');
var compression = require('compression');
var express = require('express');
var ejs = require('ejs'); // Render
var flash = require('connect-flash'); // middleware para mensajes en passport
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var routes = require('./routes/index');
var paypalr = require('./routes/paypal');
var Spec = require('./models/specification.js');
//MongoDB 
var dbConfig = require('./models/db.js');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var bCrypt = require('bcryptjs');
// mailer
// var nodemailer = require('nodemailer');
var mailer = require('./modules/send_email.js');
var passportSocketIo = require('passport.socketio');
// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://jerh56%40gmail.com:1J79ol4f*3@smtp.gmail.com');
// var transporter = require("nodemailer-smtp-transport")
var app = express();
app.io = require('socket.io')();
var helmet = require('helmet'); // Seguridad 
var session = require('express-session'); // Manejo de sesiones
var RedisStore = require('connect-redis')(session); // conexión a REDIS para almacenar sesiones de usuario
var RedisConf = JSON.parse(process.env.REDIS_CONF);
var sessionRedis = new RedisStore({
   host: RedisConf.host,
   port: RedisConf.port,
   db: RedisConf.db,
   pass:  RedisConf.pass
 });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// manejador de vistas ejs para usar HTML en lugas de archivos .jade
//app.set('view engine', 'ejs');
// Usar HTML en lugar de archivos ejs para mayor facilidad de los diseñadores.
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/htmls')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var SessionConf = JSON.parse(process.env.SESSION_CONF);
app.use(session({store: sessionRedis, secret: SessionConf.secret, resave: true, saveUninitialized: true }));
//app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.io.use(passportSocketIo.authorize({
  key: SessionConf.key,
  secret: SessionConf.secret,
  store: sessionRedis,
  passport: passport,
  cookieParser: cookieParser
}));
// para redirigir a https
if (app.get('env') !== 'development') {
  app.use (function (req, res, next) {
     var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase();
     if (schema === 'https') {
         next();
     } else {
       res.redirect('https://' + req.headers.host + req.url);
     }
   });
}
app.use('/', routes);
app.use('/users', users);
app.use('/paypalr', paypalr);
// Usar compresión de archivos para mejorar rendimiento
app.use(compression());
// PASSPORT.
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
// Initialize Passport and restore authentication state, if any, from the
// session.

// PASSPORT

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});


//app.enable('trust proxy');

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
//process.env.CLIENT_ID,
 //process.env.CLIENT_SECRET,
passport.use(new FacebookStrategy({
    clientID     : config.facebook.key, 
    clientSecret : config.facebook.secret,
    callbackURL  : config.facebook.callbackURL,
    auth_type    : 'reauthenticate',
    profileFields: ['id','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
      
  process.nextTick(function() {
      //console.log(profile);
      User.findOne({provider_id:profile.id},function(err, user) {
          // In case of any error return
           if (err){
             console.log('Error al crear cuenta: '+err);
             return done(err);
           }
           //console.log("prueba 2");
         // already exists
          if (user) {
            console.log('Usuario ya existe');
            return done(null, user,{message:'Se registró correctamente el usuario'});
      
          } 
          else {
            // if there is no user with that email
            // create the user
            //console.log(profile);
            var newUser = new User();
            // set the user's local credentials
            newUser.provider_id = profile.id;
            newUser.provider = profile.provider;
            newUser.usertype = 'user';
            newUser.userlongname = profile.displayName;
            newUser.disabled = false;
            //newUser.photo = profile.photos[0].value;
   
            // save the user
            newUser.save(function(err) {
              if (err){
                console.log('No se pudo guardar el usuario: '+err);  
                throw err;  
              }
              console.log('Se registró correctamente el usuario'); 
              createfreespec(newUser._id,function(err,message_spec){
                console.log(message_spec);
                return done(null, newUser, {message:'Se registró correctamente el usuario'});
              });   
              
            }
            );
          }
        });

      // console.log(accessToken);
      
      // return cb(null, profile);

   });

  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
//passport.serializeUser(function(user, cb) {
//  cb(null, user);
//});

//passport.deserializeUser(function(obj, cb) {
//  cb(null, obj);
//});



passport.serializeUser(function(user, done) {
  done(null, user);
});
 
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        passReqToCallback : true,
        clientID        : config.google.key,
        clientSecret    : config.google.secret,
        callbackURL     : config.google.callbackURL,

    },
    function(req, token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {


            User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
               if (user && user.provider != 'google') {

                    // if a user is found, log them in
                    return done(null, false, req.flash('message', 'Ya te registraste usando esta cuenta de correo de Google, ingresa con password'));
                    //return done(err, null, req.flash('message', 'Oops! Mauvais password.'));
                    //return done('<H1>Problem </h1>', user, {message: 'Ya te registraste usando esta cuenta de correo'});
                }
                else
                {

                  // try to find the user based on their google id
                  User.findOne({ 'provider_id' : profile.id }, function(err, user) {
                      if (err)
                          return done(err);

                      if (user && (user.usertype =='user' || user.usertype =='business' )){
                          // valida si el usuario es cliente tipo usuario o cuenta empresarial
                          // if a user is found, log them in
                          return done(null, user);
                      } else {
                          // if the user isnt in our database, create a new user
                          //console.log(profile);
                          var newUser  = new User();

                          // set all of the relevant information
                          newUser.provider_id  = profile.id;
                          newUser.provider  = 'google';
                          
                          newUser.googletoken = token;
                          newUser.userlongname  = profile.displayName;
                          newUser.usertype = 'user';
                          newUser.email = profile.emails[0].value; // pull the first email
                          newUser.disabled = false;

                          // save the user
                          newUser.save(function(err) {
                              if (err)
                                  throw err;

                              createfreespec(newUser._id,function(err,message_spec){
                                console.log(message_spec);
                                return done(null, newUser);
                              });     
                              
                          });
                      }
                  });
                }


             });

           
            
        });

    }));


// PASSPORT


// passport.use(new LocalStrategy(function(username, password,done){
//     Users.findOne({ username : username},function(err,user){
//         if(err) { return done(err); }
//         if(!user){
//             return done(null, false, { message: 'Incorrect username.' });
//         }

//         hash( password, user.salt, function (err, hash) {
//             if (err) { return done(err); }
//             if (hash == user.hash) return done(null, user);
//             done(null, false, { message: 'Incorrect password.' });
//         });
//     });
// }));



// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email'
   },
  function(req,username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'email' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method

        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('No se encontró el usuario'+username);
          return done(null, false, req.flash('message', 'La cuenta no existe.'));                 
        }

        if(user.provider=='google' || user.provider=='facebook'){
          return done(null, false, req.flash('message', 'La cuenta se registró con Google o Facebook y no es válida.'));                 
        }

        if(user.usertype !='user' && user.usertype !='business'){
          return done(null, false, req.flash('message', 'La cuenta no es de un usuario válido'));                 
        }

        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Contraseña inválida');
          return done(null, false, req.flash('message', 'Contraseña inválida.'));
        }
        // User exists but is disabled, log the error 
        if (isDisabled(user)){
          console.log('Usuario inhabilitado');
          return done(null, false, req.flash('message', 'Cuenta inhabilitada, favor de entrar a tu bandeja de correo para habilitar tu cuenta'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user,req.flash('message', 'Inicio de sesión correcto.'));
      }
    );
}));

passport.use('signup', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email'
  },
  function(req, username, password, done) {
    //console.log("prueba");
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
     var acceptTerm = req.param('accept_terms');
     if (acceptTerm === undefined){
        return done(null, false,{message:'Acepte los términos y condiciones por favor'});
     }
     User.findOne({'email':username},function(err, user) {
        // In case of any error return
         if (err){
           console.log('Error al crear cuenta: '+err);
           return done(err);
         }
         //console.log("prueba 2");
       // already exists
        var v_userlongname = req.param('userlongname');
        if (user  && v_userlongname !== 'demoimgnpro' ) {
          console.log('User already exists');
          return done(null, false,{message:'El correo ya existe'});
        } 
        else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.userlongname = req.param('userlongname');
          newUser.password = createHash(password);
          newUser.email = username;
          newUser.accept_terms = req.param('accept_terms');
          newUser.usertype = 'user';
          if(config.register.usermustactivate === true){
            newUser.disabled = true;
          }
          else
          {
            newUser.disabled = false;
          }
          

 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('No se pudo guardar el usuario: '+err);  
              throw err;  
            }
            console.log('Se registró correctamente el usuario');
                
            var mailOptions = {
                from: '"Welcome" <welcome@mail-imgnpro.com>', // sender address
                to: username, // list of receivers
                subject: 'Hello', // Subject line
                text: 'Welcome', // plaintext body
                //html: '<a href="www.imgnpro.com/confirmuser"</a>' // html body
                html: '<html>Hi '+ newUser.userlongname  +  '.<br><b>To confirm your account please click the link below</b><br><a href="' + req.headers.host + '/confirmuser/' + newUser._id+'">Confirm acccount</a><br>' + req.headers.host + '/confirmuser/' + newUser._id + '</html>' // html body
            };
            console.log(mailOptions);
            mailer.sendEmail(mailOptions);
            //send mail with defined transport object
            // transporter.sendMail(mailOptions, function(error, info){
            //     if(error){
            //         return console.log(error);
            //     }
            //     console.log('Message sent: ' + info.response);
            // });
            createfreespec(newUser._id,function(err,message_spec){
              console.log(message_spec);
              return done(null, newUser, {message:'Se registró correctamente el usuario'});
            }); 
            
          }
          );
        }
      });

    };
 
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));



// passport/login.js
passport.use('de_login', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email'
   },
  function(req,username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'email' :  username }, 
      function(err, user) {
        // In case of any error, return using the done method

        if (err)
          return done(err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('No se encontró el usuario'+username);
          return done(null, false, req.flash('message', 'La cuenta no existe.'));                 
        }

        if(user.provider=='google' || user.provider=='facebook'){
          return done(null, false, req.flash('message', 'La cuenta se registró con Google o Facebook y no es válida.'));                 
        }

        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Contraseña inválida');
          return done(null, false, req.flash('message', 'Contraseña inválida.'));
        }
        // User exists but is disabled, log the error 
        if (isDisabled(user)){
          console.log('Usuario inhabilitado');
          return done(null, false, req.flash('message', 'Cuenta inhabilitada, favor de entrar a tu bandeja de correo para habilitar tu cuenta'));
        }
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user,req.flash('message', 'Inicio de sesión correcto.'));
      }
    );
}));

passport.use('de_signup', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email'
  },
  function(req, username, password, done) {
    //console.log("prueba");
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
     User.findOne({'email':username},function(err, user) {
        // In case of any error return
         if (err){
           console.log('Error al crear cuenta: '+err);
           return done(err);
         }
         //console.log("prueba 2");
       // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,{message:'El correo ya existe'});
        } 
        else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.userlongname = req.param('userlongname');
          newUser.password = createHash(password);
          newUser.email = username;
          newUser.accept_terms = req.param('accept_terms');
          newUser.usertype = 'designer';
          if(config.register.designermustactivate === true){
            newUser.disabled = true;
          }
          else
          {
            newUser.disabled = false;
          }
          
          
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('No se pudo guardar el usuario: '+err);  
              throw err;  
            }
            console.log('Se registró correctamente el usuario');    
            return done(null, newUser, {message:'Se registró correctamente el usuario'});
          }
          );
        }
      });

    };
 
    // Delay the execution of findOrCreateUser and execute 
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  }));

console.log('Environment: ' + app.get('env'));
console.log(config.facebook.appname);

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};

var isDisabled = function(user){
  return  user.disabled;
};

// Generates hash using bCrypt
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};


function createfreespec(userid,cb){
// _id: 57e7ff183cd647de5089ef74,
  //   totalprice: '2.05',
  //   naturalshadow: '0.55',
  //   marginnone: 'none',
  //   sizenone: 'none',
  //   alignnone: 'none',
  //   userid: '57abccb7595b239d492a2ca7',
  //   dpinone: 'none',
  //   background: 'blanco',
  //   colormode: 'rgb',
  //   format: 'jpg',
   //   name: 'GRATIS',
//   __v: 0,
  //   typespec: 'normal',
//   disabled: false,
//   date: Sun Sep 25 2016 10:45:52 GMT-0600 (MDT) }


    console.log(userid);
    console.log('User id ' + userid);
      var newSpec = new Spec();
      // set the user's local credentials
      newSpec.name = 'GRATIS';
      //newSpec.naturalshadow = config.prices.naturalshadow;
      newSpec.marginnone = 'none';
      newSpec.sizenone = 'none';
      newSpec.alignnone = 'none';
      newSpec.userid = userid; 
      newSpec.dpinone = 'none';
      newSpec.background = 'blanco';
      newSpec.colormode = 'rgb';
      newSpec.format = 'jpg';
      newSpec.format_ext = 'jpg';
      newSpec.typespec = 'free';
      newSpec.maxfiles = 3;


      //var specInfos = [];
      //specInfos[0].naturalshadow = 1;
      spectotalprice(newSpec,function(total){
        //res.setHeader('Content-Type', 'application/json');
        //res.send(JSON.stringify({ error: 0, ntotal:total , message: 'Se guardó la especificación'})); 
          newSpec.totalprice = 0;
          newSpec.save(function(err) {
            if (err){
              console.log('No se pudo guardar la especificación: ' + err); 
              //res.setHeader('Content-Type', 'application/json');
              //res.send(JSON.stringify({ error: 1, message: 'No se pudo guardar la especificación'})); 
              //throw err;  
              cb(1,'No se pudo guardar la especificación: ' + err);
            }
            console.log('Se generó correctamente la especificación');
            //res.setHeader('Content-Type', 'application/json');
            //res.send(JSON.stringify({ error: 0, newSpecid: newSpec._id, message: 'Se generó correctamente la especificación'})); 
            cb(0,'Se generó correctamente la especificación');
          });

      });
}

function spectotalprice(req, cb){
  
  // se agrega a nTotal el costo mínimo 

  //console.log(req.param('background'));
  console.log(req); 
  //console.log(parseFloat(req.body.naturalshadow));
  // se multiplica por 100 para quitar los decimales y evitar errores de precision
  var nTotal = (config.prices.cutandremove) * 100;
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
  cb(nTotal);
}

module.exports = app;
