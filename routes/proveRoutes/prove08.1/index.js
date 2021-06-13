const routes = require('express').Router();

const shopController = require('../../../controllers/prove08.1/shop');

routes
    .use('/admin', require('./admin'))
    .use('/shop', require('./shop'))
    .get('/', shopController.getIndex);

module.exports = routes;