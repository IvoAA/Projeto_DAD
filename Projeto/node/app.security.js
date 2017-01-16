//import {User} from "../angular/app/model/User";
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const FacebookStrategy = require('passport-facebook');
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sha1 = require('sha1');
var app_database_1 = require('./app.database');
class Security {
    constructor() {
        this.passport = passport;
        this.initMiddleware = (server) => {
            server.use(passport.initialize());
        };
        this.authorize = this.passport.authenticate('bearer', { session: false });
    }
}
exports.Security = Security;
let validPassword = (user, password) => {
    return sha1(password) === user.passwordHash;
};
passport.use(new LocalStrategy((username, password, done) => {
    app_database_1.databaseConnection.db.collection('users').findOne({
        username: username
    }).then(user => {
        if (user === null) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        if (!validPassword(user, password)) {
            return done(null, false, {
                message: 'Incorrect credentials.'
            });
        }
        user.token = sha1(user.username + Date.now());
        app_database_1.databaseConnection.db.collection('users')
            .updateOne({ _id: user._id }, { $set: { token: user.token } })
            .then(r => r.modifiedCount !== 1 ? done(null, false) : done(null, user))
            .catch(err => done(err));
    }).catch(err => done(err));
}));
passport.use(new BearerStrategy((token, done) => {
    app_database_1.databaseConnection.db.collection('users')
        .findOne({ token: token })
        .then((user) => user ? done(null, user, { scope: 'all' }) : done(null, false))
        .catch(err => done(err));
}));
const FACEBOOK_APP_ID = '1205063929585058';
const FACEBOOK_APP_SECRET = 'ba88cd10cbccb8cac0135a868e7a5639';
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['displayName', 'photos', 'email']
}, function (accessToken, refreshToken, profile, cb) {
    let name = profile.displayName === null ? profile.username : profile.displayName;
    /*let user = new User('', name, profile.emails[0].value, 'password', 0, 0);
    handleCallbackUser(user, cb);*/
}));
const GITHUB_CLIENT_ID = '456f3ada570903b1de87';
const GITHUB_CLIENT_SECRET = '8357f54f1bfef0f3e0bf095b689ddaef6e4ce461';
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/github/callback',
    profileFields: ['displayName', 'photos', 'email']
}, function (accessToken, refreshToken, profile, cb) {
    let name = profile.displayName == null ? profile.username : profile.displayName;
    let email = profile.emails == null ? 'email@email.com' : profile.emails[0].value;
    /*let user = new User('', name, email, 'password', 0, 0);
    handleCallbackUser(user, cb);*/
}));
const GOOGLE_CLIENT_ID = '398005282988-8d5d4t1vu0kat0pgft45f84lfbc6f2bc.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '6ThUKRAz26mBJWfWSG3tC_8m';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback',
    profileFields: ['displayName', 'photos', 'email']
}, function (accessToken, refreshToken, profile, cb) {
    let name = profile.displayName === null ? profile.username : profile.displayName;
    /*let user = new User('', name, profile.emails[0].value, 'password', 0, 0);
    handleCallbackUser(user, cb);*/
}));
/*let handleCallbackUser = (user: User, cb: any) => {
    database.db.collection('users')
        .findOne({
            username: user.username
        })
        .then((r) => {
            if (r === null) {
                user.passwordHash = sha1(user.password);
                delete user._id;
                delete user.password;
                database.db.collection('users')
                    .insertOne(user)
                    .then(result => {
                        generateToken(result.ops[0], cb);
                    })
                    .catch(err => {
                        return cb(err);
                    });
            } else {
                generateToken(r, cb);
            }
        }).catch(err => {
        return cb(err);
    });
};

let generateToken = (user: User, cb: any) => {
    user.token = sha1(user.username + Date.now());
    database.db.collection('users')
        .updateOne({_id: user._id}, {$set: {token: user.token}})
        .then(r => {
            return r.modifiedCount !== 1 ? cb(null, false) : cb(null, user)
        }).catch(err => {
        return cb(err);
    });
};*/
