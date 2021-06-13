const path = require('path');

const express = require('express');

const adminController = require('../../../controllers/prove05/admin');
const isAdmin = require('../../../middleware/prove05/is-admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAdmin, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAdmin, adminController.getProducts);

router.get('/users', isAdmin, adminController.getUsers);

// /admin/add-product => POST
router.post('/add-product', isAdmin, adminController.postAddProduct);

router.get('/edit-product/:productId', isAdmin, adminController.getEditProduct);

router.get('/edit-user/:userId', isAdmin, adminController.getUpdateUser);

router.post('/edit-product', isAdmin, adminController.postEditProduct);

router.post('/delete-product', isAdmin, adminController.postDeleteProduct);

router.post('/update-user', isAdmin, adminController.postUpdateUser);

router.post('/delete-user', isAdmin, adminController.postDeleteUser);

module.exports = router;
