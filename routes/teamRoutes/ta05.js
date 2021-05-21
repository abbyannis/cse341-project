//TA05 PLACEHOLDER
const express = require('express');
const router = express.Router();
const session = require('express-session');

router.get('/',(req, res, next) => {
    if (!req.session) {
        session({ 
            style: '', 
            counter: 0, 
        })
    }
    res.render('pages/teamActivities/ta05', { 
        title: 'Team Activity 05',
        path: '/'
    });
});

module.exports = router;