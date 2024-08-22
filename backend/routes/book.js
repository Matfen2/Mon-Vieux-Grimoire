const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/book');
const multer = require('../middleware/multer-config');

// Routes
router.get('/', auth, bookCtrl.getAllBooks);              // Récupérer tous les livres
router.post('/', auth, multer, bookCtrl.createBook);      // Créer un nouveau livre
router.get('/:id', auth, bookCtrl.getOneBook);            // Récupérer un livre spécifique
router.put('/:id', auth, multer, bookCtrl.modifyBook);    // Mettre à jour un livre spécifique
router.delete('/:id', auth, bookCtrl.deleteBook);         // Supprimer un livre spécifique
router.post('/:id/rating', auth, bookCtrl.addRating);     // Ajouter une note à un livre

module.exports = router;
