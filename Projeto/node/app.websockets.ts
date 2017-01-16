/*import {Game} from "../angular/app/model/Game";
import {TipoCelula} from "../angular/app/model/Celula";
import {Tabuleiro} from "../angular/app/model/Tabuleiro";
import {TipoNavio} from "../angular/app/model/Navio";*/
const io = require('socket.io');

export class WebSocketServer {
    public board: number[] = [];
    public io: any;
    public games = {};      // hash que associa game ids a games a decorrer
    CircularJSON = require('circular-json');

    public init = (server: any) => {
        this.io = io.listen(server);
        this.io.sockets.on('connection', (client: any) => {

            client.on('ready', (gameId, playerId, board) => {
                let g = this.games[gameId];
                let jsonboard = this.CircularJSON.parse(board); //board has circular references
                /*g.boards[playerId] = new Tabuleiro();
                // the atts and methods weren't copied because of the json so this is needed
                g.boards[playerId].celulas = jsonboard.celulas;
                g.boards[playerId].posicoesOcupadas = jsonboard.posicoes;
                g.boards[playerId].navios = jsonboard.navios;
                g.playersReady++;
                if (g.playersReady == g.players.length) {
                    g.nextPlayer = g.creator;
                    this.io.to(g._id).emit('ready', g.nextPlayer);
                }*/
            });


            client.emit('game-chat', ['System notify', 'Welcome to battleship']);

            //msg para todos
            client.on('chatAll', (data) => this.io.emit('game-chat', data));

            //msg para o user
            client.on('chatUser', (data) => client.emit('game-chat', data));

            //msg para todos menos o user
            client.on('chatOthers', (data) => client.broadcast.emit('game-chat', data));

            //msg para game room
            client.on('chatGame', (data) => this.io.to(data[2]).emit('chatGame', data));

            //board e game

            client.on('clickElement', (data) => {

                // data 0 = game id, data 1 = player, 2 = index, 3 = playsAvailable, 4 = attackerPlayer
                let line = Math.floor((data[2] / 10));
                let column = (data[2] % 10) + 1;
                let b = this.games[data[0]].boards[data[1]];
               /* let celula = b.getCelula(String.fromCharCode(65 + line), +column);
                let tiro;
                let navio = null;
                celula.tiro = true;
                if (celula.tipo == TipoCelula.Mar) {
                    tiro = 1;
                } else if (celula.tipo == TipoCelula.Navio) {
                    tiro = 2;
                    let score;
                    switch (celula.pertenceA.tipoNavio) {
                        case TipoNavio.PortaAvioes:
                            score = 20;
                            navio = TipoNavio.PortaAvioes;
                            break;
                        case TipoNavio.Couracado:
                            score = 15;
                            navio = TipoNavio.Couracado;
                            break;
                        case TipoNavio.Cruzador:
                            score = 10;
                            navio = TipoNavio.Cruzador;
                            break;
                        case TipoNavio.ContraTorpedeiro:
                            score = 5;
                            navio = TipoNavio.ContraTorpedeiro;
                            break;
                        case TipoNavio.Submarino:
                            score = 3;
                            navio = TipoNavio.Submarino;
                            break;
                    }

                    let sank = true;
                    celula.pertenceA.celulas.forEach((celula) => {
                        if (!celula.tiro) sank = false;
                    });

                    if (!sank) score = 1;
                    this.incrementScore(data[0], data[4], score);
                }
                if (data[3] == 0) {
                    this.setNextPlayer(data[0]);
                }
                let winner = this.isGameOver(data[0]);
                if (winner) {
                    this.incrementScore(data[0], data[4], 50);
                }

                this.io.to(data[0]).emit('board', [data[1], data[2], tiro, this.CircularJSON.stringify(this.games[data[0]]), navio, winner]);
                if (winner) {
                    delete this.games[data[0]];
                }*/
            });
            client.emit('board', this.board);

            client.on('joinGame', (id: any) => {
                client.join(id);
            });
            client.on('leaveGame', (id: any) => {
                client.leave(id);
            });
            client.on('deleteGame', (id: any) => {
                this.io.delete(id);
            });
            /*client.on('startGame', (game: Game) => {
                this.io.to(game._id).emit('startGame', game._id);
                this.games[game._id] = game;
                this.games[game._id].playersReady = 0;
            });*/
            client.on('updateGamesList', () => this.io.emit('updateGamesList'));

        });
    };

    public incrementScore = (gameId: string, playerId: string, score: number) => {
        this.games[gameId].players.forEach((player) => {
            if (player.player == playerId) {
                player.score += score;
            }
        });
    };

    public setNextPlayer = (gameId: string) => {
        let g = this.games[gameId];
        let l = g.players.length;
        for (let i = 0; i < l; i++) {
            if (g.players[i].player == g.nextPlayer) {
                this.games[gameId].nextPlayer = g.players[i + 1 == l ? 0 : i + 1].player;
                break;
            }
        }
    };

    public notifyAll = (channel: string, message: any) => {
        this.io.emit(channel, message);
    };

    public isGameOver(gameId: string) {
        let numberOfFinishedBoards = 0;
        let winner = '';
        this.games[gameId].players.forEach((p) => {
            let boardFinished = true;
            let board = this.games[gameId].boards[p.player];
            board.navios.forEach((n) => {
                n.celulas.forEach((c) => {
                    if (!c.tiro) {
                        boardFinished = false;
                    }
                })
            });
            if (boardFinished) numberOfFinishedBoards++;
            else winner = p.player;
        });
        if (numberOfFinishedBoards == this.games[gameId].players.length - 1) return winner;
        return null;
    }
}
