exports.changeStyle = (req, res, next) => {
    req.session.style = req.body.color;
    res.redirect('/ta05');

};

exports.postCount = (req, res, next) => {
    req.session.counter += parseInt(req.body.counter);
    res.redirect('/ta05');
};

exports.postReset = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/ta05');
    });
};