const mongodb = require('mongodb');
const util = require('util');
const sha1 = require('sha1');
var app_database_1 = require('./app.database');
class User {
    constructor() {
        this.handleError = (err, response, next) => {
            response.send(500, err);
            next();
        };
        this.returnUser = (id, response, next) => {
            app_database_1.databaseConnection.db.collection('users')
                .findOne({
                _id: id
            })
                .then((user) => {
                if (user === null) {
                    response.send(404, 'User not found');
                }
                else {
                    response.json(user);
                }
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getUsers = (request, response, next) => {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .toArray()
                .then(users => {
                response.json(users || []);
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getUser = (request, response, next) => {
            const id = new mongodb.ObjectID(request.params.id);
            console.log('server');
            this.returnUser(id, response, next);
        };
        this.updateUser = (request, response, next) => {
            const id = new mongodb.ObjectID(request.params.id);
            const user = request.body;
            if (user === undefined) {
                response.send(400, 'No user data');
                return next();
            }
            delete user._id;
            app_database_1.databaseConnection.db.collection('users')
                .updateOne({
                _id: id
            }, {
                $set: user
            })
                .then(result => this.returnUser(id, response, next))
                .catch(err => this.handleError(err, response, next));
        };
        this.createUser = (request, response, next) => {
            const user = request.body;
            if (user === undefined) {
                response.send(400, 'No user data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('users')
                .findOne({
                'username': user.username
            })
                .then((u) => {
                if (u === null) {
                    this.addUser(user, response, next);
                }
                else {
                    response.json({ 'error': true, 'message': 'User already exists' });
                    return next();
                }
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.addUser = (user, response, next) => {
            user.passwordHash = sha1(user.password);
            delete user._id;
            delete user.password;
            app_database_1.databaseConnection.db.collection('users')
                .insertOne(user)
                .then(result => this.returnUser(result.insertedId, response, next))
                .catch(err => this.handleError(err, response, next));
        };
        this.deleteUser = (request, response, next) => {
            let id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('users')
                .deleteOne({
                _id: id
            })
                .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('User -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No user found');
                }
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getTop10Victories = (request, response, next) => {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalVictories: -1 })
                .limit(10)
                .toArray()
                .then(users => {
                response.json(users || []);
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getTop10Points = (request, response, next) => {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalPoints: -1 })
                .limit(10)
                .toArray()
                .then(users => {
                response.json(users || []);
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        // Routes for the games
        this.init = (server, settings) => {
            server.get(settings.prefix + 'top10v', settings.security.authorize, this.getTop10Victories);
            server.get(settings.prefix + 'top10p', settings.security.authorize, this.getTop10Points);
            server.get(settings.prefix + 'users', settings.security.authorize, this.getUsers);
            server.get(settings.prefix + 'users/:id', settings.security.authorize, this.getUser);
            server.put(settings.prefix + 'users/:id', settings.security.authorize, this.updateUser);
            server.post(settings.prefix + 'users', this.createUser);
            server.del(settings.prefix + 'users/:id', settings.security.authorize, this.deleteUser);
            console.log("Users routes registered");
        };
    }
}
exports.User = User;
