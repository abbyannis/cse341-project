const fetch = require('node-fetch');
const Pokemon = require('../../models/prove09/pokemon');


const settings = { method: "Get" };

exports.getPokemon = (req, res, next) => {
    let page = req.query.page;
    let offset = 0;
    if(!page) {
        page = 1;
    } else {
        offset = (page - 1) * 10;
    }
    const url = "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=10";
  
    Pokemon.fetchAll(url, pokemon => {
        const images = [];
        const totalItems = pokemon.count;
        const lastPage = Math.ceil(totalItems / 10);
        res.render('pages/proveAssignments/prove09/pokemon', {
            pokemon: pokemon,
            pageTitle: 'Pokemon List',
            path: '/',
            hasPreviousPage: pokemon.previous,
            previousOffset: offset - 10,
            previousPage: (page * 1) - 1,
            hasNextPage: pokemon.next,
            nextOffset: offset + 10,
            nextPage: (page * 1) + 1,
            page: offset/10 + 1,
            lastPage: lastPage,
            images: images
        });
    });
  };