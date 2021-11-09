const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const mongooseExpressErrorHandler = require('mongoose-express-error-handler');
const mongoKey = require('./mongoKey');
const helmet = require("helmet");

const app = express();


const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');



mongoose.connect(mongoKey,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use(mongooseExpressErrorHandler);
app.use(helmet());

module.exports = app;