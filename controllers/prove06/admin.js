const Product = require('../../models/product');
const User = require('../../models/user');
const  { validationResult } = require('express-validator');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
  res.render('pages/proveAssignments/prove06/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    isAuthenticated: req.session.isLoggedIn,
    userType: req.session.userType,
    currentUser: req.session.user
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const author = req.body.author;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/proveAssignments/prove06/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        author: author,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
      userType: req.session.userType,
      currentUser: req.session.user
    });
  }
  const product = new Product({
    // _id: new mongoose.Types.ObjectId('609f22e659fb5100040a0604'),
    title: title, 
    author: author,
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
    //   return res.status(500).render('pages/proveAssignments/prove06/admin/edit-product', {
    //     pageTitle: 'Add Product',
    //     path: '/admin/add-product',
    //     editing: false,
    //     hasError: true,
    //     errorMessage: 'Database operation failed, please try again',
    //     product: {
    //       title: title,
    //       imageUrl: imageUrl,
    //       price: price,
    //       description: description
    //     },
    //     validationErrors: [],
    //     isAuthenticated: req.session.isLoggedIn,
    //     userType: req.session.userType,
    //     currentUser: req.session.user
    //   });
      // res.redirect('../../../../proveAssignments/06/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
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

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedAuthor = req.body.author;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/proveAssignments/prove06/admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: updatedTitle,
        author: updatedAuthor,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      validationErrors: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
      userType: req.session.userType,
      currentUser: req.session.user
    });
  }

  Product.findById(prodId)
  .then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('../../../../proveAssignments/06');
    }
    product.title = updatedTitle;
    product.author = updatedAuthor;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save()
    .then(result => {
      res.redirect('../../../../proveAssignments/06/admin/products');
    })
  })
  .catch(err => {
    const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
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
  Product.deleteOne({_id: prodId, userId: req.user._id}) // built-in mongoose method
    .then(() => {
      res.redirect('../../../../proveAssignments/06/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUsers = (req, res, next) => {
  User.find({ 
    $and: [
      { email: { '$ne': req.session.user.email } },
      { email: { '$ne': 'abbygannis@gmail.com' } } 
     ] 
    })
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
.catch(err => {
  const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
});
};

exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;
  User.findByIdAndRemove(userId) // built-in mongoose method
    .then(() => {
      res.redirect('../../../../proveAssignments/06/admin/users');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};