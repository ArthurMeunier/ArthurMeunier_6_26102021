const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// FONCTION SIGNUP //
exports.signup = (req, res, next) => {
  // On crypte le mot de passe
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // On crée un nouvel user avec le mot de passe crypté et le mail de la requête
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      // On enregistre l'user dans la BDD
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// FONCTION LOGIN //
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
  // On récupère l'user de la base qui correspond à l'adresse mail entrée
    .then(user => {
      if (!user) {
        // Si le mail n'est pas bon on envoie une erreur
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
      // On compare le mot de passe entré avec le hash stocké en BDD :
      // --- Si la comparaison n'est pas bonne on renvoie une erreur
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // --- Si la comparaison est bonne, on renvoie l'userId et un token
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
