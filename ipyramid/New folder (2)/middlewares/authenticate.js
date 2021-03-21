

//is logged in middleware

module.exports.isLoggedin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you need to log in')
        return res.redirect('/user/login')
    }
    next()
}

module.exports.isAdmin = (req, res, next) => {
    const { username } = req.user;
    if (username !== 'admin') {
        req.flash('error', 'you do not have permission to access this link')
        console.log('you do not have permission to access this link')
        return res.redirect('/user/login')
    }
    next();
}
