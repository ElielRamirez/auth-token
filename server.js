const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const passportConfig = require('./config/passport');

const MONG_URL = 'mongodb://127.0.0.1:27017/sesiones_auth';
const app = express();
app.set('port', process.env.PORT || 3000);

mongoose.Promise = global.Promise;
mongoose.connect(MONG_URL, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', (err) => {
    throw err;
    process.exit(1);
});

const User = require('./models/User');


//Middlewares
app.use(session({
    secret: 'secret-password',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: MONG_URL,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//controllers
const authController = require('./controllers/authControlller');

//Routes
app.post('/signup', authController.postSignup);
app.post('/login', authController.postLogin);
app.get('/logout', passportConfig.estaAutenticado, authController.logout);
app.get('/userInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
});
// running server
app.listen(app.get('port'), () => { console.log('server listen on port: ' + app.get('port')); });