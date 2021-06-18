const fetch = require('node-fetch');

 //const url = "https://pokeapi.co/api/v2/pokemon?offset=10&limit=10";
 const settings = { method: "Get" };


const getPokemonFromWeb = (url, cb) => {
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if (!json) {
        cb([]);
        } else {
        const pokemon = (json);
        cb(pokemon);
        }
    })
    .catch(err => {
        console.log(err);
    })
};

module.exports = class Pokemon {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  static fetchAll(url, cb) {
    getPokemonFromWeb(url, cb);
  }
};
