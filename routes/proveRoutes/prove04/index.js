const routes = require('express').Router();
const User = require('../../../models/user');
const mongoose = require('mongoose');
const cors = require('cors');
const shopController = require('../../../controllers/prove04/shop');

const MONGODB_URI = process.env.MONGODB_URI_SHOP; 

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

routes.use((req, res, next) => {
    mongoose.connection.close();
    mongoose.connect(
        MONGODB_URI,
        options
     )
     .then(result => {
        User.findOne().then(user => { // findOne with no arguments always returns the first object
            if (!user) {
                const user = new User({
                    first: 'Abby',
                    last: 'Annis',
                    email: 'abbyannis@gmail.com',
                    password: 'password',
                    userType: 'admin',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        User.findById('60a0335a72ef66391ca31c28')
            .then(user => {
                req.user = user;
                next();
            })
            .catch(err => 
                console.log(err)
            );
        });
    });
    

routes
    .use('/admin', require('./admin'))
    .use('/shop', require('./shop'))
    .get('/', shopController.getIndex);

module.exports = routes;