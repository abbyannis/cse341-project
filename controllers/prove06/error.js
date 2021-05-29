exports.get404 = (req, res, next) => {
    res.status(404).render('pages/proveAssignments/prove06/404', { pageTitle: 'Page Not Found', path: '/404',
    isAuthenticated: req.session.isLoggedIn,
    userType: req.session.userType,
    currentUser: req.session.user });
  };

exports.get500 = (req, res, next) => {
    res.status(500).render('pages/proveAssignments/prove06/500', { pageTitle: 'Error!', path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    userType: req.session.userType,
    currentUser: req.session.user });
  };
  