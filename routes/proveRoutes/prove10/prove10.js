const express = require('express');
const router = express.Router();

// Path to your JSON file, although it can be hardcoded in this file.
const dummyData = require('../../../data/ta10-data.json')

router.get('/fetchAll', (req, res, next) => {
    res.json(dummyData);
});

router.post('/insert', (req, res, next) => {
    if (req.body.newName !== undefined && req.body.newSuperName != undefined) {
        const newName = req.body.newName;
        const newSuperName = req.body.newSuperName;
        const imageUrl = req.body.newImageUrl;

        if (!dummyData.avengers.some(a => a.name === newName)) {
            dummyData.avengers.push({ 
                name: newName, 
                superName: newSuperName,
                imageUrl: imageUrl
            });
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(400);
    }
});

router.get('/', (req, res, next) => {
    res.render('pages/proveAssignments/prove10/prove10', {
        pageTitle: 'Prove 10',
        path: '/proveAssignments/10',
    });
});

module.exports = router;