const express = require('express'); // Importation du framework Express
const router = express.Router(); // Création d'un routeur Express

const auth = require("../middleware/auth"); // Importation du middleware d'authentification
const multer = require("../middleware/multer-config"); // Importation du middleware de gestion des fichiers

const bookCtrl = require('../controllers/book'); // Importation du contrôleur des livres

// Route pour créer un nouveau livre
router.post("/", auth, multer.upload, multer.optimizeImage, bookCtrl.createBook);

// Route pour mettre à jour un livre existant
router.put("/:id", auth, multer.upload, multer.optimizeImage, bookCtrl.modifyBook);

// Route pour supprimer un livre existant
router.delete("/:id", auth, bookCtrl.deleteBook);

// Route pour obtenir les livres avec les meilleures notes
router.get("/bestrating", bookCtrl.bestRatings);

// Route pour obtenir un livre par son ID
router.get("/:id", bookCtrl.getOneBook);

// Route pour noter un livre existant
router.post("/:id/rating", auth, bookCtrl.rateOneBook);

// Route pour obtenir tous les livres
router.get('/', bookCtrl.getAllBooks);

module.exports = router; // Exportation du routeur pour l'utiliser dans l'application principale
