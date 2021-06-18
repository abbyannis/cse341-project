const path = require('path');

const express = require('express');

const pokemonController = require('../../../controllers/prove09/pokemon');

const router = express.Router();

router.get('/', pokemonController.getPokemon);

module.exports = router;