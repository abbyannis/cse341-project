module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn || req.session.userType !== 'admin') {
        return res.redirect('/proveAssignments/05/auth/login');
    }
    next();
}