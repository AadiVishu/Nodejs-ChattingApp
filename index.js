const express = require('express');
const app = require('express')();
const path = require('path');
const router = require('./controller/app-controller');
const http = require('http').createServer(app);
const io = require('socket.io')(http);


// file direction settings:
app.set('view engine','ejs');
app.set('views', path.join(__dirname , 'views'));

//static files setup e.g css,js,images:
app.use(express.static('assets'));
app.use('/css', express.static(__dirname + 'assets/css'));
app.use('/js', express.static(__dirname + 'assets/js'));
app.use('/images',express.static(__dirname + 'assets/images'));


// All nevigation to router:
app.get('/', router);
app.get('/chatapp', router);
app.get('/register',router);
app.post('/register',router);
app.get('/login',router);
app.post('/login',router);
app.get('/logout',router);
app.get('/profile',router);


io.on('connection', (socket) => {
  console.log('a user connected');
});

http.listen(4000, () => {
  console.log('listening on :4000');
});