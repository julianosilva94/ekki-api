const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const authController = require('./controllers/authController');
const creditCardController = require('./controllers/creditCardController');
const transferController = require('./controllers/transferController');
const userController = require('./controllers/userController');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('API Working');
});

authController(app);
creditCardController(app);
transferController(app);
userController(app);

app.listen(PORT, HOST);
