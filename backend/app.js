const path = require('path'); // Module pour gérer et transformer les chemins de fichiers
const express = require('express'); // Framework pour créer des applications web en Node.js
const mongoose = require('mongoose'); // ORM pour interagir avec MongoDB
const userRoutes = require('./routes/user'); // Importation des routes d'authentification
const bookRoutes = require('./routes/book'); // Importation des routes liées aux livres
const app = express(); // Création de l'application Express

require('dotenv').config(); // Chargement des variables d'environnement depuis un fichier .env
app.use(express.json()); // Middleware pour parser le corps des requêtes en JSON

// Connexion à MongoDB avec la variable d'environnement MONGODB
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.log('Connexion à MongoDB échouée !', error));

// Gestion des CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next(); 
});

// Middleware pour servir les fichiers statiques (ex : images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Définir les routes pour les livres
app.use("/api/books", bookRoutes);

// Définir les routes pour l'authentification
app.use("/api/auth", userRoutes);

module.exports = app; // Exportation de l'application Express pour l'utiliser dans d'autres fichiers
