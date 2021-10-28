const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // On indique à multer d'enregistrer les fichiers dans le dossier "images" :
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // On indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des "_"
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    // On y ajoute un timestamp "Date.now()"
    callback(null, name + Date.now() + '.' + extension);
  }
});


module.exports = multer({storage: storage}).single('image');