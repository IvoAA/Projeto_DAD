const restify = require('restify');
const passport = require('passport');
const path = require('path');
const multer = require('multer');
var app_database_1 = require('./app.database');
var app_websockets_1 = require('./app.websockets');
var handler_settings_1 = require('./handler.settings');
var app_security_1 = require('./app.security');
var app_users_1 = require('./app.users');
var app_games_1 = require('./app.games');
var app_authentication_1 = require('./app.authentication');
const url = 'mongodb://localhost:27017/project';
// Create Restify and WebSocket Server
const restifyServer = restify.createServer();
const socketServer = new app_websockets_1.WebSocketServer();
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
let security = new app_security_1.Security();
security.initMiddleware(restifyServer);
// Settings are used on all HTTP (Restify) Handlers
let settings = new handler_settings_1.HandlerSettings(socketServer, security, '/api/v1/');
// Authentication Handlers
new app_authentication_1.Authentication().init(restifyServer, settings);
// Users Handler
new app_users_1.User().init(restifyServer, settings);
// Games Handler
new app_games_1.Game().init(restifyServer, settings);
restifyServer.get(/^\/(?!api\/).*/, restify.serveStatic({
    directory: './../angular',
    default: 'index.html'
}));
let storage = multer.diskStorage({
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
    res.json({ error_code: 0, err_desc: null });
    next();
});
app_database_1.databaseConnection.connect(url, () => {
    restifyServer.listen(8080, () => console.log('%s listening at %s', restifyServer.name, restifyServer.url));
    // Websocket is initialized after the server
    socketServer.init(restifyServer.server);
});
