const fetch = require('node-fetch');
const Pokemon = require('../../models/prove09/pokemon');

const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=10";
const settings = { method: "Get" };

exports.getPokemon = (req, res, next) => {
    const limit = req.params.limit;
    const offset = req.params.offset;
  
    Pokemon.fetchAll(pokemon => {
      res.render('pages/proveAssignments/prove09/pokemon', {
        pokemon: pokemon,
        // page: page,
        pageTitle: 'Pokemon List',
        path: '/',
        // totalProducts: total_items,
        // hasNextPage: ITEMS_PER_PAGE * page < total_items,
        // hasPreviousPage: page > 1,
        // hasThirdPage: 3 < total_pages,
        // hasFourthPage: 4 < total_pages,
        // nextPage: (page * 1) + 1,
        // previousPage: (page * 1) - 1,
        // maxPage: total_pages
      });
    });
  };