//var express = require('express');
var compression = require('compression');
var express = require('express');
var ejs = require('ejs');
var flash = require('connect-flash'); // middleware para mensajes en passport
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
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

// REDIS

var SequenceGenerator = require('mysequence').SequenceGenerator;
var SequenceStore = require('mysequence').SequenceStore;
var redisClient = require('redis');
var store = new SequenceStore({
    keyPrefix: 'seq:id:',
    redis: redisClient,
    logger: console
});

    var generator = new SequenceGenerator();
    generator.useLogger(console); //set logger here, or just use console as logger
    generator.useStore(store);    //set store here, here we use default redis store

    /*
     * set default sequence config in case of client don't config it.
     */
    generator.useDefaults({
        initialCursor: 0, //default start number for a new sequence
        segment: 20000,   //default segment width which a sequence apply once
        prebook: 18000    //default prebook point when a sequence start to apply a segment in advance
    });

    /**
     * put each of sequence config here
     */
    generator.putAll(
        [{
            key: 'Employee', //the sequence's name which is store in redis.
            initialCursor: 0,     //the sequence's initial value to start from
            segment: 100,         //a number width to increase before sequence touch the segment end.
            prebook: 60           //It means when to book segment. the value is normally
                                  //between half segment (50) and near segment end (90).
        },{
            key: 'User',
            //initialValue: 100,  //by default, use 0
            //segment: 1000,      //by default, use 20000
            //prebook: 500        //by default, use 18000
        }]
    );

    /*
     * Invoke #init method to initialize/sync all sequence to store(redis) until callback
     * is invoked with true parameter.
     */
    generator.init(function(result){
        if(!result){
            throw new Error('generator is not ready');
        }
        var so = generator.get('Employee'); //get a ready sequence object.
        console.log(so.next().val); //get and output a new sequence number
        console.log(so.next().val); //get and output a another sequence number
    });






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


/*
 * Load the S3 information from the environment variables.
 */


// var newUser1 = new User();
//           // set the user's local credentials
// newUser1.userlongname = "Juan Ernesto";
// newUser1.password = "12345";
// newUser1.email = "miemail@gmail.com";
// // save the user
// newUser1.save(function(err) {
//   if (err){
//     console.log('No se pudo guardar el usuario: '+err);  
//     throw err;  
//   }
//   console.log('Se registró correctamente el usuario');    
// });


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
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
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
passport.use(new Strategy({
    clientID     : config.facebook.key, 
    clientSecret : config.facebook.secret,
    callbackURL  : config.facebook.callbackURL,
    auth_type    : 'reauthenticate',
    profileFields: ['id','displayName','photos']
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log(accessToken);
    
    return cb(null, profile);
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
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


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
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user,req.flash('message', 'Inicio de sesión correcto.'));
      }
    );
}));

// passport.use('login', new LocalStrategy(
//   function(username, password, done) { 
//     // check in mongo if a user with username exists or not
//     User.findOne({ 'username' :  username }, 
//       function(err, user) {
//         // In case of any error, return using the done method
//         if (err)
//           return done(err);
//         // Username does not exist, log error & redirect back
//         if (!user){
//           console.log('User Not Found with username '+username);
//           console.log(err);
//           return done(null, false, {message:'User Not found.'});                 
//         }
//         // User exists but wrong password, log the error 
//         if (!isValidPassword(user, password)){
//           console.log('Invalid Password');
//           return done(null, false, {message:'Password invalid'});
//         }
//         // User and password both match, return user from 
//         // done method which will be treated like success
//         return done(null, user);
//       }
//     );
// }));


// passport.use('signup', new LocalStrategy({
//     passReqToCallback : true
//   },
//   function(req, username, password, done) {
//     findOrCreateUser = function(){
//       // find a user in Mongo with provided username
//       User.findOne({'username':username},function(err, user) {
//         // In case of any error return
//         if (err){
//           console.log('Error in SignUp: '+err);
//           return done(err);
//         }
//         // already exists
//         if (user) {
//           console.log('User already exists');
//           return done(null, false, 
//              req.flash('message','User Already Exists'));
//         } else {
//           // if there is no user with that email
//           // create the user
//           var newUser = new User();
//           // set the user's local credentials
//           newUser.username = username;
//           newUser.password = createHash(password);
//           newUser.email = req.param('email');
//           newUser.firstName = req.param('firstName');
//           newUser.lastName = req.param('lastName');
 
//           // save the user
//           newUser.save(function(err) {
//             if (err){
//               console.log('Error in Saving user: '+err);  
//               throw err;  
//             }
//             console.log('User Registration succesful');    
//             return done(null, newUser);
//           });
//         }
//       });
//     };
     
//     // Delay the execution of findOrCreateUser and execute 
//     // the method in the next tick of the event loop
//     process.nextTick(findOrCreateUser);
//   })
// );




passport.use('signup', new LocalStrategy({
    passReqToCallback : true,
    usernameField: 'email'
  },
  function(req, username, password, done) {
    console.log("prueba");
    findOrCreateUser = function(){
      // find a user in Mongo with provided username
     User.findOne({'email':username},function(err, user) {
        // In case of any error return
         if (err){
           console.log('Error al crear cuenta: '+err);
           return done(err);
         }
         console.log("prueba 2");
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

          
          // var newUser = new mongoose.model('User').create();
          // // set the user's local credentials
          // newUser.userlongname = req.param('userlongname');
          // newUser.password = createHash(password);
          // newUser.email = username;
          // newUser.accept_terms = req.param('accept_terms');
 
          // // save the user
          // newUser.save(function(err) {
          //   if (err){
          //     console.log('No se pudo guardar el usuario: '+err);  
          //     throw err;  
          //   }
          //   console.log('Se registró correctamente el usuario');    
          //   return done(null, newUser, {message:'Se registró correctamente el usuario'});
          
          // }

          // );
          
console.log('Environment: ' + app.get('env'));
    

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = app;
