const routes = require('express').Router();
const mongoose = require('mongoose');

mongoose.connection.close();
mongoose.connect(
    'mongodb+srv://abbyannis:2JoxKnRiQhaFn0kY@cluster0.epw8q.mongodb.net/teamDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true }
)
.then(result => {
    console.log(result);
})
.catch(err => 
    console.log(err)
);

routes
    .use('/01', require('./ta01'))
    .use('/02', require('./ta02'))
    .use('/03', require('./ta03'))
    .use('/04', require('./ta04'))
   /* .get('/proveAssignments/02', (req, res, next) => {
        res.redirect('../../proveAssignments/02');
    })*/
    .get('/', (req, res, next) => {
        res.render('pages/teamActivities/', {
            pagetTitle: 'Team Activities',
            path: '/' 
        });
    });

module.exports = routes;