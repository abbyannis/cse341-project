const routes = require('express').Router();

const shopController = require('../../../controllers/prove08.1/shop');

routes
    .get('/', require('./pokemon'));

module.exports = routes;