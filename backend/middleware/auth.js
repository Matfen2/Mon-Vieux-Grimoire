const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Headers:', req.headers);

  try {
    const authorization = req.headers.authorization;
    console.log('Authorization Header:', authorization);

    if (!authorization) {
      throw 'Requête non authentifiée';
    }

    const token = authorization.split(' ')[1];
    console.log('Token:', token);

    // Utiliser la clé secrète depuis .env
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken);

    const userId = decodedToken.userId;
    req.auth = { userId };
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Requête non authentifiée' });
  }
};
