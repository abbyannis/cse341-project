const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const Cart = require('./cart');

const url = "https://byui-cse.github.io/cse341-course/lesson03/items.json";
const settings = { method: "Get" };

const p = path.join(
    path.dirname(require.main.filename),
  'data',
  'products.json'
);

const getProductsFromWeb = cb => {
  fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
      if (!json) {
        cb([]);
      } else {
        const product = (json);
        product.sort(GetSortOrder('name'));
        cb(product);
      }
    })
    .catch(err => {
      console.log(err);
    })
  // fs.readFile(p, (err, fileContent) => {
  //   if (err) {
  //     cb([]);
  //   } else {
  //     const product = (JSON.parse(fileContent));
  //     product.sort(GetSortOrder('name'));
  //     cb(product);
  //   }
  // });
};

function GetSortOrder(prop) {
    return function(a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1
        }
        return 0;
    }
}

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    
    getProductsFromWeb(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex (prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductsFromWeb(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      })
    });
  }

  static fetchAll(cb) {
    getProductsFromWeb(cb);
  }

  static findById(id, cb) {
    getProductsFromWeb(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
