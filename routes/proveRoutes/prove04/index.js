const routes = require('express').Router();
const User = require('../../../models/prove04/user');
const mongoose = require('mongoose');
const cors = require('cors');

const shopController = require('../../../controllers/prove04/shop');
const MONGODB_URI_SHOP = process.env.MONGODB_URI_SHOP || 'mongodb+srv://abbyannis:2JoxKnRiQhaFn0kY@cluster0.epw8q.mongodb.net/shop?retryWrites=true&w=majority';

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
        MONGODB_URI_SHOP,
        options
     )
     .then(result => {
        User.findOne().then(user => { // findOne with no arguments always returns the first object
            if (!user) {
                const user = new User({
                    name: 'abbyannis',
                    email: 'abbyannis@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        User.findById('609b302c7a32e511607f9608')
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