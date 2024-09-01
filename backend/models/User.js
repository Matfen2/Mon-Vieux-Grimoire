const mongoose = require('mongoose'); // Importation de Mongoose pour gérer la base de données MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Importation du plugin pour garantir l'unicité des emails

// Définition du schéma pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Adresse e-mail de l'utilisateur, unique et obligatoire
  password: { type: String, required: true } // Mot de passe de l'utilisateur, obligatoire
});

// Application du plugin uniqueValidator pour garantir l'unicité de l'email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema); // Exportation du modèle User pour l'utiliser dans d'autres fichiers
