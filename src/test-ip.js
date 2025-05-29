const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`IP pública del servidor: ${req.connection.remoteAddress}`);
}).listen(3000, () => {
  console.log('Servidor escuchando en puerto 3000');
});
