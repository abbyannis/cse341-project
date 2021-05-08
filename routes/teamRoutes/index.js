const routes = require('express').Router();

routes
    .use('/01', require('./ta01'))
    .use('/02', require('./ta02'))
    .use('/03', require('./ta03'))
    .use('/04', require('./ta04'))
    .get('/proveAssignments/02', (req, res, next) => {
        res.redirect('../../proveAssignments/02');
    })
    .get('/', (req, res, next) => {
        res.render('pages/teamActivities/', {
            pagetTitle: 'Team Activities',
            path: '/' 
        });
    });

module.exports = routes;