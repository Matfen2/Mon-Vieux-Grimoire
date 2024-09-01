const jwt = require('jsonwebtoken'); // Importation de la bibliothèque JSON Web Token pour la gestion des tokens

module.exports = (req, res, next) => {
  console.log('Headers:', req.headers); 

  try {
    const authorization = req.headers.authorization; // Extraire l'en-tête Authorization
    console.log('Authorization Header:', authorization);

    if (!authorization) {
      throw 'Requête non authentifiée'; // Si l'en-tête n'est pas présent, lancer une exception
    }

    const token = authorization.split(' ')[1]; // Extraire le token de l'en-tête Authorization
    console.log('Token:', token);

    // Décoder le token en utilisant la clé secrète stockée dans l'environnement
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken);

    const userId = decodedToken.userId; // Extraire l'userId du token décodé
    req.auth = { userId }; // Ajouter l'userId à l'objet req pour l'utiliser dans les prochains middlewares
    next(); // Passer au middleware suivant
  } catch (error) {
    console.error('Authentication Error:', error); // En cas d'erreur, loguer l'erreur
    res.status(401).json({ error: 'Requête non authentifiée' }); // Envoyer une réponse avec le statut 401 (Unauthorized)
  }
};
