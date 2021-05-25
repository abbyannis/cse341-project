const routes = require('express').Router();

routes
   // .use('/01', require('./pa01'))
    .use('/02', require('./pa02'))
    .use('/03', require('./prove03'))
    .use('/04', require('./prove04'))
    .use('/05', require('./prove05'))
    .use('/06', require('./prove06'))
    .get('/', (req, res, next) => {
        res.render('pages/proveAssignments/', {
            pagetTitle: 'Prove Assignments',
            path: '/proveAssignments' 
        });
    });

module.exports = routes;