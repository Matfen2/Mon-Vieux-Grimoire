const http = require('http'); // Module HTTP de Node.js pour créer le serveur
const app = require('./app'); // Importation de l'application Express
const dotenv = require('dotenv').config(); // Chargement des variables d'environnement

// Fonction pour normaliser le port d'écoute
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Retourner le port en tant que chaîne de caractères
  }
  if (port >= 0) {
    return port; // Retourner le port en tant que nombre
  }
  return false; // Retourner false si le port n'est pas valide
};

const port = normalizePort(process.env.PORT || '4000'); // Définir le port de l'application, par défaut 4000
app.set('port', port); // Définir le port sur l'application

// Gestionnaire d'erreurs pour le serveur
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error; // Si l'erreur n'est pas liée à l'écoute, lancer l'erreur
  }
  const address = server.address(); // Obtenir l'adresse du serveur
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' nécessite des privilèges élevés.');
      process.exit(1); // Sortir du processus si les privilèges sont insuffisants
      break;
    case 'EADDRINUSE':
      console.error(bind + ' est déjà utilisé.');
      process.exit(1); // Sortir du processus si le port est déjà utilisé
      break;
    default:
      throw error; // Lancer l'erreur pour tout autre code d'erreur
  }
};

// Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

server.on('error', errorHandler); // Attacher le gestionnaire d'erreurs au serveur
server.on('listening', () => {
  const address = server.address(); // Obtenir l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); // Afficher le message d'écoute
});

server.listen(port); // Démarrer le serveur sur le port spécifié
