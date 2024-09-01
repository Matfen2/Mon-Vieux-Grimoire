const express = require('express'); // Importation d'Express pour créer le routeur
const router = express.Router(); // Création d'une instance de routeur Express
const userCtrl = require('../controllers/user'); // Importation du contrôleur utilisateur

// Route pour l'inscription
router.post('/signup', userCtrl.signup);

// Route pour la connexion
router.post('/login', userCtrl.login);

module.exports = router; // Exportation du routeur pour l'utiliser dans l'application principale
