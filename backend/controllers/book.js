const Book = require("../models/book"); // Importation du modèle Book pour interagir avec la base de données
const fs = require("fs"); // Importation du module fs pour gérer les fichiers

// Créer un livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Parse le corps de la requête pour obtenir les données du livre
  delete bookObject._id; // Supprime l'ID, car MongoDB va générer un nouvel ID
  delete bookObject._userId; // Supprime le userId pour éviter toute modification non autorisée
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Ajoute l'userId authentifié au livre
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // Génère l'URL de l'image à partir du fichier téléchargé
  });

  // Sauvegarde le livre dans la base de données
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" }); // Réponse en cas de succès
    })
    .catch((error) => {
      res.status(400).json({ error }); // Réponse en cas d'erreur
    });
};

// Obtenir tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find() // Recherche de tous les livres dans la base de données
  .then ((books)=>{
    res.status(201).json(books); // Retourne tous les livres trouvés
  })
  .catch((error)=>{
    res.status(400).json({ error }); // Retourne une erreur en cas d'échec
  });
}

// Obtenir un seul livre par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({_id:req.params.id}) // Recherche un livre par son ID
  .then ((books)=>{
    res.status(201).json(books); // Retourne le livre trouvé
  })
  .catch((error)=>{
    res.status(400).json({ error }); // Retourne une erreur en cas d'échec
  });
}

// Modifier un livre
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`, // Met à jour l'image si un nouveau fichier est téléchargé
      }
    : { ...req.body };

  delete bookObject._userId; // Empêche toute modification de l'userId

  // Recherche du livre à modifier par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification de l'utilisateur propriétaire du livre
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" }); // Si l'utilisateur n'est pas le propriétaire, retour d'une erreur
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            // Suppression de l'ancienne image si une nouvelle image est fournie
            if (req.file && book.imageUrl) {
              const imagePath = book.imageUrl.split("/images/")[1];
              fs.unlinkSync(`images/${imagePath}`);
            }
            res.status(200).json({ message: "Livre modifié!" }); // Confirmation de la modification
          })
          .catch((error) => res.status(401).json({ error })); // Gestion des erreurs
      }
    })
    .catch((error) => {
      res.status(400).json({ error }); // Retourne une erreur en cas d'échec de la recherche du livre
    });
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche un livre par son ID
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" }); // Vérifie que l'utilisateur est bien le propriétaire du livre
      } else {
        const filename = book.imageUrl.split("/images/")[1]; // Extraction du nom de fichier de l'image
        fs.unlink(`images/${filename}`, () => { // Suppression de l'image du fichier système
          Book.deleteOne({ _id: req.params.id }) // Suppression du livre de la base de données
            .then(() => {
              res.status(200).json({ message: "Livre supprimé" }); // Confirmation de la suppression
            })
            .catch((error) => res.status(401).json({ error })); // Gestion des erreurs
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); // Gestion des erreurs serveur
    });
};

// Obtenir les livres les mieux notés
exports.bestRatings = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 }) // Trie les livres par note moyenne décroissante
    .limit(3) // Limite le résultat aux 3 meilleurs livres
    .then((books) => {
      res.status(200).json(books); // Retourne les livres trouvés
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" }); // Gestion des erreurs serveur
    });
};

// Noter un livre
exports.rateOneBook = (req, res, next) => {
  const userId = req.body.userId; // ID de l'utilisateur envoyant la note
  const grade = req.body.rating; // Note attribuée

  // Vérifie que la note est bien entre 0 et 5
  if (grade < 0 || grade > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5." });
  }

  // Recherche du livre à noter par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(400).json({ message: "Livre non trouvé! " }); // Si le livre n'existe pas
      }
      if (book.userId === req.auth.userId) {
        return res.status(401).json({ message: "Unauthorized" }); // Empêche le propriétaire du livre de noter son propre livre
      }

      // Vérifie si l'utilisateur a déjà noté ce livre
      const hasAlreadyRated = book.ratings.some(
        (rating) => rating.userId.toString() === userId
      );
      if (hasAlreadyRated) {
        return res
          .status(400)
          .json({ message: "L'utilisateur a déjà noté ce livre" }); // Empêche de noter plusieurs fois le même livre
      }
      book.ratings.push({ userId, grade }); // Ajoute la nouvelle note

      // Recalcul de la moyenne des notes.
      const totalGrade = book.ratings.reduce(
        (accumulator, currentValue) => accumulator + currentValue.grade,
        0
      );
      const averageRating = totalGrade / book.ratings.length;

      // Arrondit la moyenne à un seul chiffre après la virgule
      const roundedAverageRating = parseFloat(averageRating.toFixed(1));

      // Met à jour la moyenne dans le livre.
      book.averageRating = roundedAverageRating;

      // Sauvegarde les modifications dans la base de données.
      book
        .save()
        .then(() => res.status(200).json(book)) // Confirme l'enregistrement de la note et de la nouvelle moyenne
        .catch((error) => res.status(400).json({ error })); // Gestion des erreurs
    })
    .catch((error) => res.status(400).json({ error })); // Gestion des erreurs lors de la recherche du livre
};
