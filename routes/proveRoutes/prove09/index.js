const routes = require('express').Router();

const shopController = require('../../../controllers/prove08.1/shop');

var cors = require('cors');
var bodyParser = require('body-parser');

//enables cors
routes.use(cors({
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'origin': '*',
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}));

routes
    .get('/', require('./pokemon'));

module.exports = routes;