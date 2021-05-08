const routes = require('express').Router();

routes
   // .use('/01', require('./pa01'))
    .use('/02', require('./pa02'))
   // .use('/03', require('./pa03'))
   // .use('/04', require('./pa04'))
    .get('/', (req, res, next) => {
        res.render('pages/proveAssignments/', {
            pagetTitle: 'Prove Assignments',
            path: '/proveAssignments' 
        });
    });

module.exports = routes;