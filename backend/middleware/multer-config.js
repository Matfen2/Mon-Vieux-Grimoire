const multer = require('multer'); // Bibliothèque pour la gestion des fichiers téléchargés
const path = require('path'); // Module pour travailler avec les chemins de fichiers
const sharp = require('sharp'); // Bibliothèque pour le traitement des images
const fs = require('fs'); // Module pour interagir avec le système de fichiers

// Dictionnaire des types MIME autorisés et leurs extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Spécifie le dossier de destination pour les fichiers téléchargés
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); // Remplace les espaces par des underscores dans le nom du fichier
    const extension = MIME_TYPES[file.mimetype]; // Obtient l'extension du fichier à partir du type MIME
    callback(null, name + Date.now() + '.' + extension); // Concatène le nom du fichier avec un timestamp pour éviter les doublons
  }
});

// Middleware pour optimiser l'image téléchargée
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next(); // Si aucun fichier n'est téléchargé, passer au middleware suivant

  const originalImagePath = req.file.path; // Chemin de l'image originale
  const optimizedImageName = `optimized_${path.basename(
    req.file.filename,
    path.extname(req.file.filename)
  )}.webp`; // Création du nom de l'image optimisée avec extension .webp
  const optimizedImagePath = path.join('images', optimizedImageName); // Chemin de l'image optimisée

  try {
    sharp.cache(false); // Désactiver le cache de sharp pour cette opération
    await sharp(originalImagePath)
      .webp({ quality: 80 }) // Convertir l'image en .webp avec une qualité de 80%
      .resize(400) // Redimensionner l'image à une largeur de 400 pixels
      .toFile(optimizedImagePath); // Enregistrer l'image optimisée

    req.file.filename = optimizedImageName; // Remplacer le nom de fichier dans req.file avec celui de l'image optimisée

    // Supprimer l'image originale après optimisation.
    fs.unlink(originalImagePath, (error) => {
      if (error) {
        console.error("Impossible de supprimer l'image originale :", error);
        return next(error); // Passer l'erreur au middleware suivant si la suppression échoue
      }
      next(); // Passer au middleware suivant après l'optimisation et la suppression
    });
  } catch (error) {
    next(error); // En cas d'erreur lors de l'optimisation, passer au middleware suivant
  }
};

// Exportation des fonctionnalités de téléchargement et d'optimisation d'image
module.exports = {
  upload: multer({ storage }).single('image'), // Middleware pour gérer un seul fichier avec multer
  optimizeImage, // Middleware pour optimiser l'image
};
