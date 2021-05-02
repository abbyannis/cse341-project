const path = require('path');

const express = require('express');

const router = express.Router();

const books = [];

router.get('/', (req, res, next) => {
    res.render('add-book', {books: books, 
        pageTitle: 'Add Book Info', 
        path: '/'
    });
});

router.post('/add-book', (req, res, next) => {
    books.push({title: req.body.title, summary: req.body.summary});
    res.redirect('/books');
});

router.get('/books', (req, res, next) => {
    res.render('books', {books: books, 
        pageTitle: 'Books', 
        path: '/books'
    });
});

exports.routes = router;