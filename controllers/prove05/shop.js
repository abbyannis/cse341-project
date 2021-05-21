const Product = require('../../models/product');
const Order = require('../../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .sort('title')
    .then(products => {
      console.log(products);
      res.render('pages/proveAssignments/prove05/shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) // findById is mongoose method
    .then(product => {
      res.render('pages/proveAssignments/prove05/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .sort('title')
    .then(products => {
      res.render('pages/proveAssignments/prove05/shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      console.log("getCart: " + products);
      let cartTotal = 0;
      let message = "";
      for (var i = 0; i < products.length; ) {
        // if product still available, calculate product total
        if(products[i].productId) {
          products[i].totalPrice = Number(products[i].productId.price) * Number(products[i].quantity);
          cartTotal += products[i].totalPrice;
          i++;
        // remove from array and cart if product unavailable, create removed message
        } else {
          console.log("delete: " + products[i]._id);
          req.user.removeDeletedItem(products[i]._id);
          products.splice(i, 1);
          message = "Please note: One or more items are no longer available and have been removed from your cart."
        }
      }
      res.render('pages/proveAssignments/prove05/shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        cartTotal: cartTotal,
        message: message,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/proveAssignments/05/shop/cart');
    });

};

exports.updateCart = (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;
  Product.findById(prodId)
    .then(product => {
      return req.user.updateCart(product, quantity);
    })
    .then(result => {
      res.redirect('/proveAssignments/05/shop/cart');
    });

};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/proveAssignments/05/shop/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products
    });
    return order.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/proveAssignments/05/shop/orders');
  })
  .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('pages/proveAssignments/prove05/shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};
