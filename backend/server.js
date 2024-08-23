const http = require('http');
const app = require('./app');

// Normaliser le port pour s'assurer qu'il est bien formaté
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;  // Si ce n'est pas un nombre, retourne la valeur telle quelle
  }
  if (port >= 0) {
    return port;  // Si c'est un nombre positif, retourne le port
  }
  return false;  // Sinon, retourne false
};

// Utilise le port 4000 par défaut, ou celui défini dans les variables d'environnement
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' nécessite des privilèges élevés.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' est déjà utilisé.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Le serveur écoute sur ' + bind);
});

// Lancer le serveur sur le port spécifié
server.listen(port);
