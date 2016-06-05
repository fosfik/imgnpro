var express = require('express');
var router = express.Router();


var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var config = require('../config');


/* GET home page. */
//router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
//});

// PASSPORT

// Define routes.
router.get('/',
  function(req, res) {
    res.render('index', { user: req.user });
    console.log(req.user);
  });

router.get('/login',
  function(req, res){
    res.render('login');
  });

router.get('/logout',
  function(req, res){
     
res.redirect('https://www.facebook.com/logout.php?next=localhost:3000/&access_token='+passport.accessToken);
req.logOut();
     req.session.destroy();
     res.clearCookie('connect.sid');

     setTimeout(function() {
        res.redirect("/");
     }, 2000);
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


module.exports = router;
