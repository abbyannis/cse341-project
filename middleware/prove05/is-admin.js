module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/proveAssignments/05/auth/login');
    } 
    if (req.session.userType !== 'admin') {
        return res.redirect('/proveAssignments/05/');
    }
    next();
}