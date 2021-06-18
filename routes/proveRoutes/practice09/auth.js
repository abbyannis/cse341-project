const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../../../controllers/practice09/auth');
const User = require('../../../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/edit-profile', authController.getProfile);

router.get('/update-password', authController.getUpdatePassword);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/login', 
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and letters and at least 5 characters'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ], 
authController.postLogin);

router.post(
    '/signup',
    [ 
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email exists already. Please choose a different email.');
                    }
            });
        }),
        body(
            'password',
            'Please enter a password with only numbers and letters and at least 5 characters'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
        body('first')
            .isLength({ min: 1 })
            .withMessage('First name required'),
        body('last')
            .isLength({ min: 1 })
            .withMessage('Last name required')   
    ], 
authController.postSignup);

router.post('/edit-profile', 
    [ 
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        body('first')
            .isLength({ min: 1 })
            .withMessage('First name required'),
        body('last')
            .isLength({ min: 1 })
            .withMessage('Last name required')   
    ],
authController.postUpdateProfile);

router.post('/update-password', 
[ 
    body(
        'password',
        'Please enter a password with only numbers and letters and at least 5 characters'
    )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })   
],
authController.postUpdatePassword);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/new-password', authController.postNewPassword);

module.exports = router;