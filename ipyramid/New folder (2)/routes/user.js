const express = require('express');
const userRouter = express.Router();
const flash = require('connect-flash')
const User = require("../models/User");
const passport = require('passport')
const app = express()

app.use(flash())

//GET REGISTER PAGE FORM
userRouter.get('/register', (req, res)=>{
    res.render('user/register')

});

//REGISTER USER
userRouter.post('/register', async (req, res, next)=>{
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
        })
        req.flash('success', `Welcome ${username}`)
        res.redirect('user/login')
    } catch (e) {
        req.flash('error', e.message)
        console.log(e.message)
        res.redirect('/user/register')
    }

});

//GET LOGIN FORM PAGE 
userRouter.get('/login', (req, res)=>{
    res.render('user/login')
});

userRouter.post('/login', passport.authenticate('local', { failureFlash: false, failureRedirect: '/user/login' }), (req, res) => {
    const redirectUrl = req.session.returnTo || '/blogs'
    delete req.session.returnTo
    req.flash('success', 'Welcome')
    res.redirect(redirectUrl);
})

//LOGOUT USER
userRouter.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/user/login')
});

module.exports = userRouter;
