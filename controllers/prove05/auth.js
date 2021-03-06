const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
       api_key: process.env.API_KEY 
   } 
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('pages/proveAssignments/prove05/auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        userType: req.session.userType,
        currentUser: req.session.user
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('pages/proveAssignments/prove05/auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
        currentUser: req.session.user
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/proveAssignments/05/auth/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.userType = user.userType;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/proveAssignments/05/');
                        });   
                    }
                    req.flash('error', 'Invalid email or password');
                    res.redirect('/proveAssignments/05/auth/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/proveAssignments/05/auth/login');
            })
            
        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email exists already. Please choose a different email.')
                return res.redirect('/proveAssignments/05/auth/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        first: first,
                        last: last,
                        email: email,
                        password: hashedPassword,
                        userType: 'user',
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/proveAssignments/05/auth/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'abbygannis@gmail.com',
                        subject: 'The Shop Registration Successful',
                        html: '<p>Dear ' + first + ',</p>' +
                            '<p>Thank your for registering with The Shop!</p>' +
                            '<p>Sincerely,</p>' +
                            '<p> The Shop Staff</p>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });   
        }) 
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/proveAssignments/05');
    });
};
  