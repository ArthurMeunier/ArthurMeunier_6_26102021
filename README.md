# Hot Takes
Projet n°6 du parcours "Développeur Web" d'Openclassrooms : **"Construisez une API sécurisée pour une application d'avis gastronomiques"**

## Utilisation
- Ajoutez votre clé mongoDB dans le fichier mongoKey_temp.js

- cd backend
  nodemon server

- cd frontend
  npm start

## Fonctionnalités
L'entreprise souhaite créer une application web dans laquelle les utilisateurs peuvent ajouter leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

## Contraintes techniques

- Le mot de passe de l'utilisateur doit être haché.

- L'authentification doit être renforcée sur toutes les routes sauce requises.

- Les adresses électroniques dans la base de données sont uniques et un plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler les erreurs.

- La sécurité de la base de données MongoDB (à partir d'un service tel que MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la machine d'un utilisateur.

- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base de données.

- Les versions les plus récentes des logiciels sont utilisées avec des correctifs de sécurité actualisés.

- Le contenu du dossier images ne doit pas être téléchargé sur GitHub.