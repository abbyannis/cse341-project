module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/proveAssignments/06/auth/login');
    }
    next();
}