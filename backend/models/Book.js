const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },          // Identifiant de l'utilisateur qui a créé le livre
  title: { type: String, required: true },           // Titre du livre
  author: { type: String, required: true },          // Auteur du livre
  imageUrl: { type: String, required: true },        // URL de l'image de couverture du livre
  year: { type: Number, required: true },            // Année de publication du livre
  genre: { type: String, required: true },           // Genre du livre
  ratings: [                                         // Tableau de notes données par les utilisateurs
    {
      userId: { type: String, required: true },      // Identifiant de l'utilisateur qui a noté le livre
      grade: { type: Number, required: true }        // Note attribuée au livre
    }
  ],
  averageRating: { type: Number, default: 0 },       // Note moyenne calculée à partir des notes
});

module.exports = mongoose.model('Book', bookSchema);
