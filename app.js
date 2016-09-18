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
var routes = require('./routes/index');
var users = require('./routes/users');

//MongoDB 
var dbConfig = require('./models/db.js');
var mongoose = require('mongoose');
var User = require('./models/user.js');
var bCrypt = require('bcrypt');

// mailer
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
//var transporter = nodemailer.createTransport('smtps://jerh56%40gmail.com:1J79ol4f*3@smtp.gmail.com');

var transporter = require("nodemailer-smtp-transport")
var app = express();

var transporter = nodemailer.createTransport(transporter({
    host : "imaginadores.mail-imgnpro.com",
    ignoreTLS : true,
    secureConnection : false,
    port: 2525,
    auth : {
        user : "becomeapartner@mail-imgnpro.com",
        pass : "1m4g3npr0"
    }
}));

// var smtpTransport = nodemailer.createTransport(smtpTransport({
//     host : "YOUR SMTP SERVER ADDRESS",
//     secureConnection : false,
//     port: 587,
//     auth : {
//         user : "YourEmail",
//         pass : "YourEmailPassword"
//     }
// }));

// var transporter = nodemailer.createTransport({
//    service: "Gmail",  // sets automatically host, port and connection security settings
//    auth: {
//        user: "jerh56@gmail.com",
//        pass: "1J79ol4f*3"
//    }
// });
// setup e-mail data with unicode symbols



//mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// manejador de vistas ejs para usar HTML en lugas de archivos .jade
//app.set('view engine', 'ejs');
// Usar HTML en lugar de archivos ejs para mayor facilidad de los diseñadores.
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

// app.use(bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// })); 


// el orden de los app.use es importante

// app.configure(function() {
//   app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use(app.router);
// });
// Docs

// cookieParser
// session
// passport.initialize
// passport.session
// app.router

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/htmls')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
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
// para redirigir a https
// Prueba del uso de middleware de express incorporando una función que siempre se ejecuta
// app.use(function (req, res, next) {
//   console.log('Time:', Date.now());
//   next();
// });
//
app.use('/', routes);
app.use('/users', users);

// Usar compresión de archivos para mejorar rendimiento
app.use(compression());

// PASSPORT.
//var app = express();

// app.configure(function() {
//   app.use(express.static('public'));
//   app.use(express.cookieParser());
//   app.use(express.bodyParser());
//   app.use(express.session({ secret: 'keyboard cat' }));
//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use(app.router);
// });


// Configure view engine to render EJS templates.
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
//app.use(require('cookie-parser')());
//app.use(require('body-parser').urlencoded({ extended: true }));

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
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


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
              return done(null, newUser, {message:'Se registró correctamente el usuario'});
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
               if (user) {

                    // if a user is found, log them in
                    return done(null, false, req.flash('message', 'Ya te registraste usando esta cuenta de correo de Google'));
                    //return done(err, null, req.flash('message', 'Oops! Mauvais password.'));
                    //return done('<H1>Problem </h1>', user, {message: 'Ya te registraste usando esta cuenta de correo'});
                }
                else
                {

                  // try to find the user based on their google id
                  User.findOne({ 'provider_id' : profile.id }, function(err, user) {
                      if (err)
                          return done(err);

                      if (user) {

                          // if a user is found, log them in
                          return done(null, user);
                      } else {
                          // if the user isnt in our database, create a new user
                          console.log(profile);
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
                              return done(null, newUser);
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
          return done(null, false, req.flash('message', 'Correo electrónico no existe.'));                 
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
          newUser.usertype = 'user';
          newUser.disabled = true;
 
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
                html: 'Hi '+ newUser.userlongname  +  '.<br><b>To confirm your account please click the link below</b><br><a href="www.imgnpro.com/confirmuser/' + newUser._id+'">Confirm acccount</a>' // html body
            };
            console.log(mailOptions);
            //send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
                if(error){
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
            });

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
          return done(null, false, req.flash('message', 'Correo electrónico no existe.'));                 
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
          newUser.disabled = true;
          
 
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
}

var isDisabled = function(user){
  return  user.disabled;
}

// Generates hash using bCrypt
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = app;
