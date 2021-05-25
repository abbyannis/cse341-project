const Product = require('../../models/product');
const User = require('../../models/user');

exports.getAddProduct = (req, res, next) => {
  res.render('pages/proveAssignments/prove06/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
    userType: req.session.userType,
    currentUser: req.session.user
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl, 
    userId: req.user
  });
  product
    .save() // coming from mongoose
    .then(result => {
      res.redirect('../../../../proveAssignments/06/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('pages/proveAssignments/prove06/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId).then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save()
  })
  .then(result => {
    res.redirect('../../../../proveAssignments/06/admin/products');
  })
.catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .sort('title')
    .then(products => {
      res.render('pages/proveAssignments/prove06/admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId) // built-in mongoose method
    .then(() => {
      res.redirect('../../../../proveAssignments/06/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getUsers = (req, res, next) => {
  User.find( { email: { '$ne': req.session.user.email } } )
    .sort('last')
    .then(users => {
      res.render('pages/proveAssignments/prove06/admin/users', {
        users: users,
        pageTitle: 'Users',
        path: '/admin/users',
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => console.log(err));
};

exports.getUpdateUser = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const userId = req.params.userId;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.redirect('/');
      }
      res.render('pages/proveAssignments/prove06/admin/edit-user', {
        pageTitle: 'Edit User',
        path: '/admin/edit-user',
        editing: editMode,
        user: user,
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user
      });
    })
    .catch(err => console.log(err));
};

exports.postUpdateUser = (req, res, next) => {
  const userId = req.body.userId;
  const updatedFirst = req.body.first;
  const updatedLast = req.body.last;
  const updatedEmail = req.body.email;
  const updatedUserType = req.body.userType;

  User.findById(userId).then(user => {
    user.first = updatedFirst;
    user.last = updatedLast;
    user.email = updatedEmail;
    user.userType = updatedUserType;
    console.log(req.session.user.email);
    console.log(updatedEmail);
    return user.save()
  })
  .then(result => {
    res.redirect('../../../../proveAssignments/06/admin/users');
  })
.catch(err => console.log(err));
};

exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;
  User.findByIdAndRemove(userId) // built-in mongoose method
    .then(() => {
      res.redirect('../../../../proveAssignments/06/admin/users');
    })
    .catch(err => console.log(err));
};