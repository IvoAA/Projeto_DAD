const mongodb = require('mongodb');
const util = require('util');
var app_database_1 = require("./app.database");
class Game {
    constructor() {
        this.handleError = (err, response, next) => {
            response.send(500, err);
            next();
        };
        this.returnGame = (id, response, next) => {
            app_database_1.databaseConnection.db.collection('games')
                .findOne({
                _id: id
            })
                .then(game => {
                if (game === null) {
                    response.send(404, 'Game not found');
                }
                else {
                    response.json(game);
                }
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getGames = (request, response, next) => {
            app_database_1.databaseConnection.db.collection('games')
                .find({
                'endDate': null
            })
                .toArray()
                .then(games => {
                let ids = [];
                for (let game of games) {
                    ids.push(mongodb.ObjectId(game.creator));
                }
                this.getUsername(Array.from(new Set(ids)), games, response, next);
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getHistoryGames = (request, response, next) => {
            app_database_1.databaseConnection.db.collection('games')
                .find({
                'status': 2
            })
                .toArray()
                .then(games => {
                let ids = [];
                for (let game of games) {
                    ids.push(mongodb.ObjectId(game.creator));
                    game.players.forEach((p) => {
                        ids.push(mongodb.ObjectId(p.player));
                    });
                }
                this.getUsername(Array.from(new Set(ids)), games, response, next);
            })
                .catch(err => this.handleError(err, response, next));
        };
        this.getGame = (request, response, next) => {
            const id = new mongodb.ObjectID(request.params.id);
            this.returnGame(id, response, next);
        };
        this.updateGame = (request, response, next) => {
            const id = new mongodb.ObjectID(request.params.id);
            const game = request.body;
            if (game === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            delete game._id;
            app_database_1.databaseConnection.db.collection('games')
                .updateOne({
                _id: id
            }, {
                $set: game
            })
                .then(result => this.returnGame(id, response, next))
                .catch(err => this.handleError(err, response, next));
        };
        this.createGame = (request, response, next) => {
            // verificar se existe um jogo com o mesmo nome ante de o inserir
            let game = request.body;
            if (game === undefined) {
                response.send(400, 'No game data');
                return next();
            }
            // fazer o addgame, usar essa func para fazer o delete do _id, e tirar esse codigo do request
            app_database_1.databaseConnection.db.collection('games')
                .insertOne(game)
                .then(result => this.returnGame(result.insertedId, response, next))
                .catch(err => this.handleError(err, response, next));
        };
        this.deleteGame = (request, response, next) => {
            const id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('games')
                .deleteOne({
                _id: id
            })
                .then(result => {
                if (result.deletedCount === 1) {
                    console.log('Game removed');
                    response.json({
                        msg: util.format('Game -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No game found');
                }
                next();
            })
                .catch(err => this.handleError(err, response, next));
        };
        // Routes for the games
        this.init = (server, settings) => {
            server.get(settings.prefix + 'games/:id', settings.security.authorize, this.getGame);
            server.get(settings.prefix + 'games', settings.security.authorize, this.getGames);
            server.get(settings.prefix + 'games-history', settings.security.authorize, this.getHistoryGames);
            server.put(settings.prefix + 'games/:id', settings.security.authorize, this.updateGame);
            server.post(settings.prefix + 'games', settings.security.authorize, this.createGame);
            server.del(settings.prefix + 'games/:id', settings.security.authorize, this.deleteGame);
            console.log("Games routes registered");
        };
    }
    getUsername(ids, games, response, next) {
        let usernames = {};
        app_database_1.databaseConnection.db.collection('users')
            .find({
            _id: { $in: ids }
        })
            .toArray()
            .then((users) => {
            for (let user of users) {
                usernames[user._id] = user.username;
            }
            response.json({ games: games, usernames: usernames });
            next();
        })
            .catch(err => this.handleError(err, response, next));
    }
}
exports.Game = Game;
