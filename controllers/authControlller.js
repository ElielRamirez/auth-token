const passport = require('passport-local');
const User = require('../models/User');

exports.postSignup = (req, res, next) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, userExist) => {
        if (userExist) {
            return res.status(400).send('email already exist, signIn now')
        }
        newUser.save((err) => {
            if (err) {
                next(err);
            }
            req.logIn(newUser, (err) => {
                if (err) {
                    next(err);
                }
                res.status(200).send('User created succesfully');
            });
        });
    });
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            next(err);
        }
        if (!user) {
            return res.staus(400).send('Invalid email or password');
        }
        req.logIn(user, (err) => {
            if (err) {
                next(err);
            }
            res.send('Login succesfully');
        });
    })(req, res, next);
}

exports.logout = (req, res, next) => {
    req.logout();
    res.send('you are Logout');
}