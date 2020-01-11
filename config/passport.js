const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email' },
    (enail, password, done) => {
        User.findOne({ email }, (err, user) => {
            if (!user) {
                return done(null, false, { message: `this email: ${email} are not register.` });
            } else {
                user.comparePassword(password, (err, match) => {
                    if (match) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid Password' });
                    }
                });
            }
        });
    }
));

exports.estaAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Authentication is require to access content');
}