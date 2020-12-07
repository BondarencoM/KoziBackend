const { DataSource } = require('apollo-datasource');
const mongoose = require("mongoose");
const { SensorFault } = require('../models/sensorfault')

class MongoDataSource extends DataSource {

    constructor({MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB,MONGO_HOST}) {
        super()
        if (mongoose.connection.readyState === 0 && !process.env.MONGO_URL) {
            mongoose.connect(`mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`, {
                useNewUrlParser: true
            });
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open', () => {
                console.log('MongoDb connected')
            });
        }
    }

    sensorFaultsFromToday(){
        return SensorFault.find({
            "timestamp": {
                $gte: new Date - 1000 * 60 * 60 * 24
            }

        })

    }

    getUserByUsername(username){
        return 
    }

}




module.exports = MongoDataSource;
