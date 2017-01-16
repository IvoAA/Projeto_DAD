const MongoClient = require('mongodb').MongoClient;
class databaseConnection {
}
databaseConnection.connect = (url, callback) => {
    MongoClient
        .connect(url)
        .then(database => {
        console.log('Connection established to', url);
        databaseConnection.db = database;
        callback();
    })
        .catch(console.error);
};
exports.databaseConnection = databaseConnection;
