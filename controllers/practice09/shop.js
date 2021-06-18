const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../../models/product');
const Order = require('../../models/order');

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
  let page = req.query.page;
  if(!page) {
    page = 1;
  }
  let totalItems = 0;

  Product.find()
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .sort('title');
    })
    .then(products => {
      total_pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      res.render('pages/proveAssignments/practice09/shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        page: page,
        totalProducts: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: (page * 1) + 1,
        previousPage: (page * 1) - 1,
        maxPage: total_pages,
        hasThirdPage: 3 < total_pages,
        hasFourthPage: 4 < total_pages,
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId) // findById is mongoose method
    .then(product => {
      res.render('pages/proveAssignments/practice09/shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .sort('title')
    .then(products => {
      res.render('pages/proveAssignments/practice09/shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
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
          req.user.removeDeletedItem(products[i]._id);
          products.splice(i, 1);
          message = "Please note: One or more items are no longer available and have been removed from your cart."
        }
      }
      res.render('pages/proveAssignments/practice09/shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        cartTotal: cartTotal,
        message: message,
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/proveAssignments/09/shop/cart');
    });

};

exports.updateCart = (req, res, next) => {
  const prodId = req.body.productId;
  const quantity = req.body.quantity;
  if (quantity < 1) {
    req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/proveAssignments/09/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  } else {
    Product.findById(prodId)
    .then(product => {
      return req.user.updateCart(product, quantity);
    })
    .then(result => {
      res.redirect('/proveAssignments/09/shop/cart');
    });
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/proveAssignments/09/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    res.redirect('/proveAssignments/09/shop/orders');
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('pages/proveAssignments/practice09/shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      } 
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.fontSize(14).text('--------------------');
      let totalPrice = 0;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title + 
            ' - ' + 
            prod.quantity + 
            ' x ' + 
            '$' + 
            prod.product.price);
      })
      pdfDoc.text('--------------------');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

      pdfDoc.end();
 
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      // file.pipe(res);
    })
    .catch(err => next(err));
};
