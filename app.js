var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
  res.render('index.html');
});

require('./socket.js')(io);

http.listen(3000, function () {
  console.log('listening on 3000');
});
