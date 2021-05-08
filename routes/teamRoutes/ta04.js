//TA04 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/teamActivities/ta04', { 
        title: 'Team Activity 04',
        path: '/'
    });
});

module.exports = router;