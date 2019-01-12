const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

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

app.use(cors());

app.get('/', (req, res) => {
  res.send('API Working');
});

authController(app);
creditCardController(app);
transferController(app);
userController(app);

app.listen(PORT, HOST);
