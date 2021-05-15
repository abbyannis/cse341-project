const Product = require('../../models/prove03/product');
const Cart = require('../../models/prove03/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/proveAssignments/prove03/shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId, product => {
    res.render('pages/proveAssignments/prove03/shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('pages/proveAssignments/prove03/shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('pages/proveAssignments/prove03/shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.AddProduct(prodId, product.price);
  });
  res.redirect('/proveAssignments/03/shop/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/proveAssignments/03/shop/cart');
  });
}

exports.getOrders = (req, res, next) => {
  res.render('pages/proveAssignments/prove03/shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('pages/proveAssignments/prove03/shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
