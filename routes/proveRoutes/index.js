const routes = require('express').Router();
const bodyParser = require('body-parser');

routes.use(bodyParser.json());

routes
   // .use('/01', require('./pa01'))
    .use('/02', require('./pa02'))
    .use('/03', require('./prove03'))
    .use('/04', require('./prove04'))
    .use('/05', require('./prove05'))
    .use('/06', require('./prove06'))
    .use('/08.1', require('./prove08.1'))
    // .use('/09', require('./practice09'))
    .use('/09', require('./prove09'))
    .use('/10', require('./prove10/prove10'))
    .get('/', (req, res, next) => {
        res.render('pages/proveAssignments/', {
            pagetTitle: 'Prove Assignments',
            path: '/proveAssignments' 
        });
    })
    .use((req, res, next) => {
        res.status(404)
            .render('pages/proveAssignments/prove06/404', { 
                pageTitle: '404 - Page Not Found', 
                path: req.url,
                isAuthenticated: false,
                userType: false,
                currentUser: false
            });
    });

module.exports = routes;