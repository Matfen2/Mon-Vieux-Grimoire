const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);  // Route pour l'authentification
app.use('/api/books', bookRoutes); // Route pour les livres

// Connexion à MongoDB
mongoose.connect('mongodb+srv://matfen20:Q4iFM73xVi6jrtIv@site-books.fvm4q.mongodb.net/?retryWrites=true&w=majority&appName=Site-Books')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.log('Connexion à MongoDB échouée !', error));

// Gestion des CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Logging pour toutes les requêtes
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use('/api/books', bookRoutes);

module.exports = app;