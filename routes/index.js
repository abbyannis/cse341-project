const routes = require('express').Router();
const teamActivities = require('./teamRoutes');
const proveAssignments = require('./proveRoutes');

routes
    .use('/teamActivities/proveAssignments/02', (req, res, next) => {
        res.redirect('/proveAssignments/02');
    })
    .use('/teamActivities/proveAssignments/03', (req, res, next) => {
        res.redirect('/proveAssignments/03');
    })
    .use('/teamActivities', teamActivities)
    .use('/proveAssignments', proveAssignments)

    .get('/', (req, res, next) => {
        res.render('pages/index', {title: 'Welcome to my CSE341 repo', path: '/'});
    })
    .use((req, res, next) => {
        res.render('pages/404', {title: '404 - Page Not Found', path: req.url});
    });

module.exports = routes;