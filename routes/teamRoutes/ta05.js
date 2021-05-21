//TA05 PLACEHOLDER
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/ta05');

const session = require('express-session');

router.get('/',(req, res, next) => {
    if (!req.session.style) {
        req.session.style = 'white';
        req.session.counter = 0;
    }
    console.log(req.session);
    res.render('pages/teamActivities/ta05', { 
        title: 'Team Activity 05', 
        path: '/ta05', // For pug, EJS 
        color: req.session.style,
        sessionCount: req.session.counter
    });
})

router.post('/change-style', controller.changeStyle);
router.post('/counter', controller.postCount);
router.post('/reset', controller.postReset);

module.exports = router;