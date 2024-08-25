const Book = require('../models/Book');
const fs = require('fs');

// Créer un livre
exports.createBook = (req, res, next) => {
  try {
    const bookObject = req.body; // JSON déjà parsé par express.json()
    delete bookObject._id;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file ? req.file.filename : 'default-image.jpg'}`
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement du livre :', error);
        res.status(400).json({ error: 'Erreur lors de la création du livre.' });
      });
  } catch (error) {
    console.error('Erreur lors de la création du livre (bloc try-catch) :', error);
    res.status(500).json({ error: 'Erreur lors de la création du livre.' });
  }
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
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then(book => {
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
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


// Ajouter une note à un livre
exports.addRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé !' });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find(r => r.userId === req.auth.userId);
      if (existingRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
      }

      // Ajouter la nouvelle note
      const rating = {
        userId: req.auth.userId,
        grade: req.body.rating,
      };
      book.ratings.push(rating);

      // Recalculer la moyenne des notes
      const total = book.ratings.reduce((sum, rate) => sum + rate.grade, 0);
      book.averageRating = total / book.ratings.length;

      // Sauvegarder le livre avec la nouvelle note et la nouvelle moyenne
      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error: 'Erreur lors de l\'enregistrement de la note.' }));
    })
    .catch(error => res.status(500).json({ error: 'Erreur lors de la récupération du livre.' }));
};