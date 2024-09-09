const mongoose = require('mongoose'); // Importation de Mongoose pour gérer la base de données MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Importation du plugin pour garantir l'unicité des emails

// Expression régulière pour valider la structure d'une adresse email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

// Définition du schéma pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [emailRegex, 'Veuillez entrer une adresse email valide'] // Ajout d'une validation de structure de l'email
  },
  password: { type: String, required: true } // Mot de passe de l'utilisateur, obligatoire
});

// Application du plugin uniqueValidator pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); // Exportation du modèle User pour l'utiliser dans d'autres fichiers
