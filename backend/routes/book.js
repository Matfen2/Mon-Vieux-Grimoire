const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

// Créer un livre
router.post("/", auth, multer.upload, multer.optimizeImage, bookCtrl.createBook);

// Mettre à jour un livre
router.put('/:id', auth, multer.upload, multer.optimizeImage, bookCtrl.modifyBook);

// Supprimer un livre
router.delete('/:id', auth, bookCtrl.deleteBook);

// Obtenir tous les livres
router.get('/', bookCtrl.getAllBooks);

// Obtenir un livre spécifique
router.get('/:id', bookCtrl.getOneBook);

// Ajouter une note à un livre
router.post('/:id/rating', auth, bookCtrl.addRating);

module.exports = router;
