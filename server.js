const http = require('http');
var express = require('express');

const port=process.env.PORT || 3000;

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/admin', function(request, response) {
  response.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/painel', function(request, response) {
  response.sendFile(path.join(__dirname, 'painel.html'));
});
// Starts the server.
server.listen(port, function() {
  console.log('Starting server on port '+ port);
});
