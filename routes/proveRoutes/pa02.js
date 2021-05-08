const path = require('path');
const express = require('express');
const router = express.Router();

const books = [];

router.get('/', (req, res, next) => {
    res.render('pages/proveAssignments/prove02/add-book', {
        books: books, 
        pageTitle: 'Add Book Info', 
        path: '/proveAssignments/02'
    });
});

router.post('/add-book', (req, res, next) => {
    books.push({title: req.body.title, summary: req.body.summary});
    res.redirect('./books');
});

router.get('/books', (req, res, next) => {
    res.render('pages/proveAssignments/prove02/books', {
        books: books, 
        pageTitle: 'Books', 
        path: '/books'
    });
});

module.exports = router;