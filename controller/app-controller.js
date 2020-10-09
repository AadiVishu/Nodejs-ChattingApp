    // const express = require('express');
    // const router = express.Router();
    // const bodyParser = require('body-parser');
    // const mongoose = require('mongoose');
    // const user = require('../models/user');
    // const session = require('express-session');
    // const cookieParser = require('cookie-parser');
    // const passport = require('passport');
    // const bcrypt = require('bcryptjs');
    // const flash = require('connect-flash');
    // const URL = "mongodb://localhost:27017/chat-app";
    const express = require('express');
    const router = express.Router();
    const mongoose = require('mongoose');
    const bodyparser = require('body-parser');
    const user = require('../models/user');
    const bcrypt = require('bcryptjs');
    const passport = require('passport');
    const session = require('express-session');
    const cookieParser = require('cookie-parser');
    const flash = require('connect-flash');
    const mongourl = "mongodb://localhost:27017/chat-app"



// using Bodyparser for getting form data
router.use(bodyparser.urlencoded({ extended: true }));
// using cookie-parser and session
router.use(cookieParser('secret'));
router.use(session({
    secret: 'secret',
    maxAge: 3600000,
    resave: true,
    saveUninitialized: true,
}));

// using passport for authentications
router.use(passport.initialize());
router.use(passport.session());
// using flash for flash messages
router.use(flash());

// MIDDLEWARES
// Global variable
router.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        res.redirect('/login');
    }
}

// Connecting To Database
// using Mongo Atlas as database
mongoose.connect(mongourl ,{
    useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log("Database Connected")
);


// ALL THE router
router.get('/', (req, res) => {
    res.render('register');
});

// router.get('/register', (req, res) => {
//     res.render('register');
// })

router.post('/register', (req, res) => {
    var { email, username, password, confirmpassword } = req.body;
    var err;
    if (!email || !username || !password || !confirmpassword) {
        err = "Please fill all input fields !";
        res.render('register', { 'err': err }); //index
    }
    if (password != confirmpassword) {
        err = "Passwords doen't match";
        res.render('register', { 'err': err, 'email': email, 'username': username }); //index
    }
    if (typeof err == 'undefined') {
        user.findOne({ email: email }, function (err, data) {
            if (err) throw err;
            if (data) {
                console.log("User Exists");
                err = "User already exists with this email !";
                res.render('register', { 'err': err, 'email': email, 'username': username }); //index
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        user({
                            email,
                            username,
                            password,
                        }).save((err, data) => {
                            if (err) throw err;
                            req.flash('success_message', "Registered successfully !");
                            res.redirect('/login');
                        });
                    });
                });
            }
        });
    }
});


// Authentication Strategy
// ---------------
var localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    user.findOne({ email: email }, (err, data) => {
        if (err) throw err;
        if (!data) {
            return done(null, false, { message: "User doesn't exists.." });
        }
        bcrypt.compare(password, data.password, (err, match) => {
            if (err) {
                return done(null, false);
            }
            if (!match) {
                return done(null, false, { message: "Password doesn't match" });
            }
            if (match) {
                return done(null, data);
            }
        });
    });
}));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    user.findById(id, function (err, user) {
        cb(err, user);
    });
});
// ---------------
// end of autentication statregy

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/chatapp',  //chatapp
        failureFlash: true,
    })(req, res, next);
});

router.get('/chatapp', checkAuthenticated, (req, res) => {  //success
    res.render('chat', { 'user': req.user });   //success
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});



//Profile page:
router.get('/profile',(req,res) => {
    // res.render('profile');
    user.findOne({email:req.body.email},(err,data) => {
        if(err) throw err;
        if(data) {
            console.log("data is paasing")
            res.render('profile', {data:data});
        }
    })
})





// router.post('/addmsg', (req, res) => {
//     user.findOneAndUpdate(
//         { email: req.user.email },
//         {
//             $push: {
//                 messages: req.body['msg']
//             }
//         }, (err, suc) => {
//             if (err) throw err;
//             if (suc) console.log("Message added successfully !"); //notification functions:
//         }
//     );
//     req.flash('success_message', "Message added successfully !");
//     res.redirect('/dashboard');
// });



module.exports = router;
