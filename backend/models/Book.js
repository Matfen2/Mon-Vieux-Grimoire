const mongoose = require('mongoose'); // Importation de Mongoose pour la gestion de la base de données MongoDB

// Définition du schéma pour les livres
const bookSchema = mongoose.Schema({
  title: { type: String, required: true }, // Titre du livre (obligatoire)
  author: { type: String, required: true }, // Auteur du livre (obligatoire)
  imageUrl: { type: String, required: true }, // URL de l'image de couverture (obligatoire)
  year: { type: Number, required: true }, // Année de publication (obligatoire)
  genre: { type: String, required: true }, // Genre du livre (obligatoire)
  ratings: [ // Tableau des notes attribuées au livre
    {
      userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true }, // Note attribuée par l'utilisateur
    },
  ],
  averageRating: { type: Number, default: 0 }, // Note moyenne du livre, initialisée à 0
  userId: { type: String, required: true }, // Identifiant de l'utilisateur qui a créé le livre (obligatoire)
});

module.exports = mongoose.model('Book', bookSchema); // Exportation du modèle Book pour l'utiliser dans d'autres fichiers
