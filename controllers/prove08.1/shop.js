const Product = require('../../models/prove08.1/product');
const Cart = require('../../models/prove08.1/cart');

const ITEMS_PER_PAGE = 10;

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  Product.fetchAll(products => {
    const paginatedItems = products.slice(offset).slice(0, ITEMS_PER_PAGE);
    const total_items = products.length;
    const total_pages = Math.ceil(total_items / ITEMS_PER_PAGE);
    res.render('pages/proveAssignments/prove08.1/shop/product-list', {
      prods: paginatedItems,
      page: page,
      pageTitle: 'Shop',
      path: '/products',
      totalProducts: total_items,
      hasNextPage: ITEMS_PER_PAGE * page < total_items,
      hasPreviousPage: page > 1,
      hasThirdPage: 3 < total_pages,
      hasFourthPage: 4 < total_pages,
      nextPage: (page * 1) + 1,
      previousPage: (page * 1) - 1,
      maxPage: total_pages
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId, product => {
    res.render('pages/proveAssignments/prove08.1/shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  Product.fetchAll(products => {
    const paginatedItems = products.slice(offset).slice(0, ITEMS_PER_PAGE);
    const total_items = products.length;
    const total_pages = Math.ceil(total_items / ITEMS_PER_PAGE);
    res.render('pages/proveAssignments/prove08.1/shop/index', {
      prods: paginatedItems,
      page: page,
      pageTitle: 'Shop',
      path: '/',
      totalProducts: total_items,
      hasNextPage: ITEMS_PER_PAGE * page < total_items,
      hasPreviousPage: page > 1,
      hasThirdPage: 3 < total_pages,
      hasFourthPage: 4 < total_pages,
      nextPage: (page * 1) + 1,
      previousPage: (page * 1) - 1,
      maxPage: total_pages
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
      res.render('pages/proveAssignments/prove08.1/shop/cart', {
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
  res.redirect('/proveAssignments/08.1/shop/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/proveAssignments/08.1/shop/cart');
  });
}

exports.getOrders = (req, res, next) => {
  res.render('pages/proveAssignments/prove08.1/shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('pages/proveAssignments/prove08.1/shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
