const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const authController = require('./controllers/authController');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('API Working');
});

authController(app);

app.listen(PORT, HOST);
