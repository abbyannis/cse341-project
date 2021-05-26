const routes = require('express').Router();
const User = require('../../../models/user');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require('../../../controllers/prove06/error');

const shopController = require('../../../controllers/prove06/shop');
const MONGODB_URI = process.env.MONGODB_URI_SHOP; 

const csrfProtection = csrf();

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

 const store = new MongoDBStore({
     uri: MONGODB_URI,
     collection: 'sessions'
 });

 routes.use(
    session({ 
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false,
        store: store
    })
);
routes.use(csrfProtection);
routes.use(flash());

routes.use((req, res, next) => {
    mongoose.connection.close();
    mongoose.connect(
        MONGODB_URI,
        options
     )
     .then(result => {
        if(!req.session.user) {
            return next();         
        }
        User.findById(req.session.user._id)
            .then(user => {
                if (!user) {
                    return next();
                }
                req.user = user;
                next();
            })
            .catch(err => {
                next(new Error(err));
            });
        });
    });

routes.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

routes
    .use('/admin', require('./admin'))
    .use('/shop', require('./shop'))
    .use('/auth', require('./auth'))
    .get('/500', errorController.get500)
    .get('/', shopController.getIndex)
    .use((error, req, res, next) => {
        // res.redirect('../../../../proveAssignments/06/500');
        res.status(500).render('pages/500', { pageTitle: 'Error!', path: '/500',
        isAuthenticated: req.session.isLoggedIn,
        userType: req.session.userType,
        currentUser: req.session.user });
    });

module.exports = routes;