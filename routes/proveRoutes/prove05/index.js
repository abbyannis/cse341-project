const routes = require('express').Router();
const User = require('../../../models/user');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const private = require('../../../util/private');

const shopController = require('../../../controllers/prove05/shop');
const MONGODB_URI = process.env.MONGODB_URI_SHOP5 || private.MONGODB_URI_SHOP5;

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
                req.user = user;
                next();
            })
            .catch(err => 
                console.log(err)
            );
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
    .get('/', shopController.getIndex);

module.exports = routes;