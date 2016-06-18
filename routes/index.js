var express = require('express');
var router = express.Router();
var multer = require('multer');
var cloudinary = require('cloudinary');
var passport = require('passport');
//var Strategy = require('passport-facebook').Strategy;
var config = require('../config');
var path = require('path');


/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

// PASSPORT

// Define routes.
// router.get('/',
//   function(req, res) {
//     res.render('index', { user: req.user });
//     //console.log(req.user);
//   });

router.get('/',
  function(req, res) {
    res.sendFile(path.join(__dirname, '../public/htmls', 'intro.html'));

    //res.sendFile('../public/htmls/intro.html' , { root : __dirname});
    //console.log(req.user);
  });

//res.sendFile(__dirname + '/indexAgent.html');

router.get('/uploadfile',
  function(req, res) {
    res.render('uploadfile', { user: req.user });
  });

router.get('/paypal',
  function(req, res) {
    res.render('paypal', { user: req.user });
  });


router.get('/login',
  function(req, res){
    res.render('login');
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



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

// app.set("view engine", "jade");
// app.use(express.static("public"));


cloudinary.config({ 
  cloud_name: config.cloudinary.cloud_name, 
  api_key: config.cloudinary.api_key, 
  api_secret: config.cloudinary.api_secret 
});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'public/uploads/');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname + '-' + Date.now());
  }
});
 

 var type = multer({ storage : storage}).single('photoimage');


router.post('/upload', type, function (req,res) {

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  var tmp_path = req.file.path;
  console.log(tmp_path);
  cloudinary.uploader.upload(req.file.path, function(result) { 
     console.log(result) 
     //res.render("index");
     res.render('photo', {file : result});
     //res.send(result);
  });

});






module.exports = router;
