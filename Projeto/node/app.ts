const restify = require('restify');
const passport = require('passport');
const path = require('path');

const multer = require('multer');

import {databaseConnection as database} from './app.database';
import {WebSocketServer} from './app.websockets';
import {HandlerSettings} from './handler.settings';
import {Security} from './app.security';
import {User} from './app.users';
import {Game} from './app.games';
import {Authentication} from './app.authentication';

const url = 'mongodb://localhost:27017/project';

// Create Restify and WebSocket Server
const restifyServer = restify.createServer();
const socketServer = new WebSocketServer();

// Prepare and configure Restify Server
restify.CORS.ALLOW_HEADERS.push("content-type");
restify.CORS.ALLOW_HEADERS.push("authorization");
restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
restifyServer.use(multer({ dest: './uploads' }).any());
restifyServer.use(restify.bodyParser());
restifyServer.use(restify.queryParser());
restifyServer.use(restify.CORS());
restifyServer.use(restify.fullResponse());

// Prepare and configure Passport based security
let security = new Security();
security.initMiddleware(restifyServer);

// Settings are used on all HTTP (Restify) Handlers
let settings = new HandlerSettings(socketServer, security, '/api/v1/');

// Authentication Handlers
new Authentication().init(restifyServer, settings);


// Users Handler
new User().init(restifyServer, settings);

// Games Handler
new Game().init(restifyServer, settings);

restifyServer.get(/^\/(?!api\/).*/, restify.serveStatic({
    directory: './../angular',
    default: 'index.html'
}));


let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        console.log("aqui2");
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

//let upload = multer({ dest: './uploads'});
let upload = multer({ storage: storage });



/** API path that will upload the file */
restifyServer.post('/upload', function (req, res, next) {
    console.log(req.files);
    req.files[0].name = 'a';
    res.json({error_code: 0, err_desc: null});
    next();

});


database.connect(url, () => {
    restifyServer.listen(8080, () => console.log('%s listening at %s', restifyServer.name, restifyServer.url));
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
