const fetch = require('node-fetch');

const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=10";
const settings = { method: "Get" };


const getPokemonFromWeb = cb => {
    fetch(url, {
        method: 'GET',
        dataType: 'json',
        headers: {
            'MIME-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then((json) => {
        if (!json) {
        cb([]);
        } else {
        const product = (json);
        cb(product);
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

//   save() {
    
//     getPokemonFromWeb(products => {
//       if (this.id) {
//         const existingProductIndex = products.findIndex (prod => prod.id === this.id);
//         const updatedProducts = [...products];
//         updatedProducts[existingProductIndex] = this;
//         fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//           console.log(err);
//         });
//       } else {
//         this.id = Math.random().toString();
//         products.push(this);
//         fs.writeFile(p, JSON.stringify(products), err => {
//           console.log(err);
//         });
//       }
//     });
//   }

//   static deleteById(id) {
//     getProductsFromWeb(products => {
//       const product = products.find(prod => prod.id === id);
//       const updatedProducts = products.filter(prod => prod.id !== id);
//       fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//         if (!err) {
//           Cart.deleteProduct(id, product.price);
//         }
//       })
//     });
//   }

  static fetchAll(cb) {
    getPokemonFromWeb(cb);
  }

//   static findById(id, cb) {
//     getProductsFromWeb(products => {
//       const product = products.find(p => p.id === id);
//       cb(product);
//     });
//   }
};
