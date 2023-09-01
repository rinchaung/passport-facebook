require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
// const debug = require('debug')('Oauth:Facebook');
const passport = require('passport');
require('./auth')(passport);

// Dir_path
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// Session middleware
app.use(session({
    secret: 'secret is my_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Define routes
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// Unauthorized 
function isLoggedIn(req, res, next) {
  req.user? next() : res.sendStatus(401); // Unauthorized
}

// Set up session management
app.use(passport.initialize());
app.use(passport.session());

// Initiate Facebook login
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook OAuth2 callback
app.get('/auth/facebook/callback', 
    passport.authenticate( 'facebook', {
        successRedirect: '/',
        failureRedirect: '/auth/facebook/failure'
    }
));

// Protected page (OR) success page
app.get('/auth/protected', isLoggedIn, (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/');
    // return;
  }

  // Access authenticated user's profile using req.user
  // res.send(`Welcome <b>${req.user.name} && ${req.user.email}</b>`);
});

// Fail Route 
app.get('/auth/facebook/failure', (req, res) => {
    res.send(`<h1>Sorry, something went wrong!</h1>`);
});

// Logout user
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
}); 

/** __Database set up__ */
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then( () => console.log(`Database setup successfully: Local mongoDB 🦫🦫🦫`))
.catch(err => console.log(err.message));

// Debugger logging
// app.use(function(err, req, res, next) {
//     debug('Error: %O', err);
//     debug('Stack trace: %O', err.stack);
//     res.status(500).send('Sorry, Something broke!');
// });

/** __Server set up__ */
const port = process.env.PORT || 8080;
const server = app.listen(port,  () => {
  console.log('Server listening on port: %d', server.address().port, '😄😄😄');
});
