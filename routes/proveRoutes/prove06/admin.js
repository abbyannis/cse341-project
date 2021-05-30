const path = require('path');

const express = require('express');
const { body } = require('express-validator');

const adminController = require('../../../controllers/prove06/admin');
const isAdmin = require('../../../middleware/is-admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAdmin, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAdmin, adminController.getProducts);

router.get('/users', isAdmin, adminController.getUsers);

// /admin/add-product => POST
router.post(
    '/add-product', 
    [
        body('title', 'Title required')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('author', 'Author(s) required')
            .isString()
            .isLength({ min: 1 })
            .trim(),
        body('imageUrl', 'Please enter a valid URL')
            .isURL(),
        body('price', 'Please enter a valid price')
            .isFloat(),
        body('description', 'Description must be between 10 and 2000 characters')
            .isLength({ min: 10, max: 2000 })
            .trim()
    ],
    isAdmin, 
    adminController.postAddProduct
);

router.get('/edit-product/:productId', isAdmin, adminController.getEditProduct);

router.get('/edit-user/:userId', isAdmin, adminController.getUpdateUser);

router.post(
    '/edit-product',
    [
        body('title', 'Title required')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('imageUrl', 'Please enter a valid URL')
            .isURL(),
        body('price', 'Please enter a valid price')
            .isFloat(),
        body('description', 'Description must be between 10 and 2000 characters')
            .isLength({ min: 10, max: 2000 })
            .trim()
    ],
    isAdmin, 
    adminController.postEditProduct
);

router.post('/delete-product', isAdmin, adminController.postDeleteProduct);

router.post('/update-user', isAdmin, adminController.postUpdateUser);

router.post('/delete-user', isAdmin, adminController.postDeleteUser);

module.exports = router;
