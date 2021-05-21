exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404',
    isAuthenticated: req.session.isLoggedIn,
    userType: req.session.userType,
    currentUser: req.session.user });
  };
  