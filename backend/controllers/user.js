const bcrypt = require('bcrypt'); // Importation de bcrypt pour le hachage des mots de passe
const User = require('../models/User'); // Importation du modèle User
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la création de tokens JWT
const dotenv = require('dotenv').config(); // Chargement des variables d'environnement

// Regex pour valider le format de l'email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Gestion de l'inscription des utilisateurs
exports.signup = (req, res, next) => {
  console.log('Requête de signup reçue:', req.body);

  // Vérification du format de l'email avant de procéder à l'inscription
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: 'Structure de l\'email incorrecte' });
  }

  // Hachage du mot de passe avec bcrypt
  bcrypt
    .hash(req.body.password, 10) // 10 est le "salt rounds", niveau de complexité du hachage
    .then((hash) => {
      const user = new User({
        email: req.body.email, // Stocke l'email de l'utilisateur
        password: hash, // Stocke le mot de passe haché
      });
      return user.save()
        .then(() => {
        console.log('Utilisateur créé avec succès');
          res.status(201).json({ message: 'Utilisateur créé' }); // Réponse en cas de succès
        }).catch((error) => {
        console.error("Erreur lors de la création de l'utilisateur:", error);
          res.status(400).json({ error }); // Réponse en cas d'erreur
        }); // Sauvegarde l'utilisateur dans la base de données
    }).catch((error) => {
      console.error("Une message s'est produite lors du cryptage du mot de passe:", error);
        res.status(400).json({ error }); // Réponse en cas d'erreur
  });
};

// Gestion de la connexion des utilisateurs
exports.login = (req, res, next) => {
  console.log('Requête de login reçue:', req.body);

  // Vérification du format de l'email avant de procéder à la connexion
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: 'Structure de l\'email incorrecte' });
  }

  // Recherche de l'utilisateur dans la base de données par email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.log('Utilisateur non trouvé');
        return res
          .status(401)
          .json({ message: 'Paire login/mot de passe incorrecte' }); // Réponse en cas de non-correspondance
      }

      console.log('Utilisateur trouvé:', user);

      // Comparaison du mot de passe fourni avec le mot de passe haché
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            console.log('Mot de passe incorrect');
            return res
              .status(401)
              .json({ message: 'Paire login/mot de passe incorrecte' }); // Réponse en cas de mot de passe incorrect
          }

          console.log('Mot de passe correct, génération du token');
          const token = jwt.sign(
            { userId: user._id }, // Payload du token : l'ID de l'utilisateur
            process.env.JWT_SECRET, // Utilisation de la clé secrète pour signer le token
            {
              expiresIn: '24h', // Durée de validité du token
            }
          );
          console.log(
            'JWT_SECRET lors de la génération du token (user) :',
            process.env.JWT_SECRET
          );

          console.log('Token:', token);
          res.status(200).json({
            userId: user._id, // Renvoie l'ID utilisateur pour des usages futurs dans l'application
            token: token, // Renvoie le token d'authentification
          });
        })
        .catch((error) => {
          console.error(
            'Erreur lors de la comparaison des mots de passe:',
            error
          );
          res.status(500).json({ error }); // Réponse en cas d'erreur serveur lors de la comparaison
        });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'utilisateur:", error);
      res.status(500).json({ error }); // Réponse en cas d'erreur serveur lors de la recherche de l'utilisateur
    });
};
