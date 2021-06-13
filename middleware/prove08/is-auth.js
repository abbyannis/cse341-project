module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/proveAssignments/08/auth/login');
    }
    next();
}