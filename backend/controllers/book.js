const Book = require('../models/Book');
const fs = require('fs');

// Créer un livre
exports.createBook = (req, res, next) => {
   const bookObject = JSON.parse(req.body.book);
   delete bookObject._id;
   delete bookObject._userId;
   const book = new Book({
       ...bookObject,
       userId: req.auth.userId,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });

   book.save()
   .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
   .catch(error => res.status(400).json({ error: 'Erreur lors de la création du livre.' }));
};

// Obtenir tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error: 'Erreur lors de la récupération des livres.' }));
};

// Obtenir un livre spécifique
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }
      res.status(200).json(book);
    })
    .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération du livre.' }));
};

// Mettre à jour un livre
exports.modifyBook = (req, res, next) => {
   const bookObject = req.file ? {
       ...JSON.parse(req.body.book),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };

   delete bookObject._userId;
   Book.findOne({ _id: req.params.id })
       .then((book) => {
           if (!book) {
               return res.status(404).json({ message: 'Livre non trouvé !' });
           }
           if (book.userId !== req.auth.userId) {
               return res.status(401).json({ message: 'Non autorisé' });
           }
           Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
           .then(() => res.status(200).json({ message: 'Livre modifié !' }))
           .catch(error => res.status(400).json({ error: 'Erreur lors de la modification du livre.' }));
       })
       .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération du livre.' }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: 'Non autorisé' });
      }
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error: 'Erreur lors de la suppression du livre.' }));
      });
    })
    .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération du livre.' }));
};
