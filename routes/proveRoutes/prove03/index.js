const routes = require('express').Router();
const User = require('../../../models/user');
const mongoose = require('mongoose');

const shopController = require('../../../controllers/shop');

routes.use((req, res, next) => {
    mongoose.connection.close();
    mongoose.connect(
        'mongodb+srv://abbyannis:2JoxKnRiQhaFn0kY@cluster0.epw8q.mongodb.net/shop?retryWrites=true&w=majority',
        { useNewUrlParser: true }
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