const Product = require('../../models/product');
const User = require('../../models/user');
const fileHelper = require('../../util/file');
const  { validationResult } = require('express-validator');
const { Mongoose } = require('mongoose');
const mongoose = require('mongoose');

exports.getAddProduct = (req, res, next) => {
  res.render('pages/proveAssignments/practice09/admin/edit-product', {
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
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if(!image) {
    return res.status(422).render('pages/proveAssignments/practice09/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: 'Attached file is not an image',
      product: {
        title: title,
        author: author,
        price: price,
        description: description
      },
      validationErrors: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
      userType: req.session.userType,
      currentUser: req.session.user
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/proveAssignments/practice09/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        author: author,
        price: price,
        description: description
      },
      validationErrors: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
      userType: req.session.userType,
      currentUser: req.session.user
    });
  }

  const imageUrl =  image.path;

  const product = new Product({
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
      res.redirect('../../../../proveAssignments/09/admin/products');
    })
    .catch(err => {
      console.log("we made it");
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
      res.render('pages/proveAssignments/practice09/admin/edit-product', {
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
  const image = req.file;
  const updatedDesc = req.body.description;
  console.log(image);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('pages/proveAssignments/practice09/admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title: updatedTitle,
        author: updatedAuthor,
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
      return res.redirect('../../../../proveAssignments/09');
    }
    product.title = updatedTitle;
    product.author = updatedAuthor;
    product.price = updatedPrice;
    product.description = updatedDesc;
    if(image) {
      fileHelper.deleteFile(product.imageUrl);
      product.imageUrl = image.path;
    }
    return product.save()
    .then(result => {
      res.redirect('../../../../proveAssignments/09/admin/products');
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
      res.render('pages/proveAssignments/practice09/admin/products', {
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

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(product => {
    if (!product) {
      return next(new Error('Product not found'));
    }
    fileHelper.deleteFile(product.imageUrl);
    return Product.deleteOne({_id: prodId, userId: req.user._id}); // built-in mongoose method
  }).then(() => {
    // res.redirect('../../../../proveAssignments/09/admin/products');
    res.status(200).json({message: 'Success!'});
  })
  .catch(err => {
    res.status(500).json({message: 'Deleting product failed!'});
    // const error = new Error(err);
    // error.httpStatusCode = 500;
    // return next(error);
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
      res.render('pages/proveAssignments/practice09/admin/users', {
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
      res.render('pages/proveAssignments/practice09/admin/edit-user', {
        pageTitle: 'Edit User',
        path: '/admin/edit-user',
        editing: editMode,
        user: user,
        first: user.first,
        last: user.last,
        email: user.email,
        userId: user._id,
        errorMessage: "",
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
  const updatedUser = req.body.user;
  
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log("user: " + updatedUser);
    return res.render('pages/proveAssignments/practice09/admin/edit-user', {
      pageTitle: 'Edit User',
      path: '/admin/edit-user',
      editing: true,
      user: updatedUser,
      first: updatedFirst,
      last: updatedLast,
      email: updatedEmail,
      userId: userId,
      errorMessage: errors.array()[0].msg,
      isAuthenticated: req.session.isLoggedIn,
      userType: req.session.userType,
      currentUser: req.session.user,
    });
  }
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
    res.redirect('../../../../proveAssignments/09/admin/users');
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
      res.redirect('../../../../proveAssignments/09/admin/users');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};