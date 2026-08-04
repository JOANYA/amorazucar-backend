var app = require('./app');
var http = require('http');

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function () {
  console.log('✅ Servidor corriendo en http://localhost:' + port);
});