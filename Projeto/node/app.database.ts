const MongoClient = require('mongodb').MongoClient;

export class databaseConnection {
    public static connect =  (url: string, callback: () => void ) => {
        MongoClient
            .connect(url)
            .then(database => {
                console.log('Connection established to', url);
                databaseConnection.db = database;
                callback();
            })
            .catch(console.error);
    };

    public static db: any;
}

