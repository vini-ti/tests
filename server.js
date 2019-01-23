const http = require('http');
var express = require('express');

const port=process.env.PORT || 3000
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Ou beleza!</h1>');
});
server.listen(port,() => {
console.log(`Server running at port `+port);
});
