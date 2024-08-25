const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const app = express();

require('dotenv').config();
app.use(express.json());

// Connexion à MongoDB avec la variable d'environnement MONGODB
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(error => console.log('Connexion à MongoDB échouée !', error));

// Gestion des CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');  
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/auth', userRoutes);  // Route pour l'authentification
app.use('/api/books', bookRoutes); // Route pour les livres

app.use("/images",express.static(path.join(__dirname,"images")));

module.exports = app;