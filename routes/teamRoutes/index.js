const routes = require('express').Router();
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const MONGODB_URI_TEAM = process.env.MONGODB_URI_TEAM; 

const corsOptions = {
    origin: "https://abbyannis-cse341-project.herokuapp.com/",
    optionSuccessStatus: 200
 };
 routes.use(cors(corsOptions));
 
 const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
 }

 routes.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false
    })
);

mongoose.connection.close();
mongoose.connect(
    MONGODB_URI_TEAM,
    options
)
.then(result => {
   // console.log(result);
})
.catch(err => 
    console.log(err)
);

routes
    .use('/01', require('./ta01'))
    .use('/02', require('./ta02'))
    .use('/03', require('./ta03'))
    .use('/04', require('./ta04'))
    .use('/05', require('./ta05'))
   /* .get('/proveAssignments/02', (req, res, next) => {
        res.redirect('../../proveAssignments/02');
    })*/
    .get('/', (req, res, next) => {
        res.render('pages/teamActivities/', {
            pagetTitle: 'Team Activities',
            path: '/' 
        });
    })
    .use((req, res, next) => {
        res.render('pages/404', {title: '404 - Page Not Found', path: req.url});
    });

module.exports = routes;