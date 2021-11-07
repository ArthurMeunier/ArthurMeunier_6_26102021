const fs = require('fs');
const Sauce = require('../models/sauce');

// FONCTION CREATESAUCE //
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
  // On créé une nouvelle constante avec une nouvelle instance de notre modèle Sauce
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersdisLiked: [],
	});
	sauce.save()
	.then(() => res.status(201).json({ message: 'La sauce à bien été enregistrée !'}))
	.catch(error => res.status(400).json({ error }));
};

// FONCTION GETALLSAUCES //
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// FONCTION GETONESAUCE
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// FONCTION MODIFYSAUCE
exports.modifySauce = (req, res, next) => {
  // On crée un obet sauceObject et on regarde si req.file existe ou pas
  const sauceObject = req.file ?
  // S'il existe on traite la nouvelle image
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      // Si il n'existe pas on traite seulement l'objet entrant
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// FONCTION DELETESAUCE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// FONCTION LIKESAUCE
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
	const sauceId = req.params.id;
	const like = req.body.like;

  switch (like) {


    case 1: {
      Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
       // Si le userId n'existe pas dans l'array userLike, on l'ajoute
       if (!sauce.usersLiked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
       // Si le userId existe dans l'array userDislike, on l'enlève
       if (sauce.usersDisliked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
     })
     .catch((error) => res.status(404).json({ error }))
      break;
    }


    case -1: {
      Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
       // Si le userId existe pas dans l'array userLike, on l'enlève
       if (sauce.usersLiked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
       // Si le userId n'existe pas dans l'array userDislike, on l'ajoute
       if (!sauce.usersDisliked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
     })
     .catch((error) => res.status(404).json({ error }))
      break;
    }


    case 0: {
      Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
      // Si le userId existe dans l'array userLike, on l'enlève
       if (sauce.usersLiked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
      // Si le userId existe dans l'array userDislike, on l'enlève
       if (sauce.usersDisliked.includes(userId)) { 
         Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
           .then(() => res.status(200).json({ message: "J'ai changé d'avis" }))
           .catch((error) => res.status(400).json({ error }))
       }
     })
     .catch((error) => res.status(404).json({ error }))
      break;
    }
 
  }
};