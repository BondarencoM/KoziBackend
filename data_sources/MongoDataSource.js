const { DataSource } = require('apollo-datasource');
const mongoose = require('mongoose');
const { SensorFault } = require('../models/sensorfault');
const { SensorMaintenance } = require('../models/SensorMaintenance');
const UserModel = require('../models/UserModel');

class MongoDataSource extends DataSource {
  constructor({ MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB, MONGO_HOST }) {
    super();
    if (mongoose.connection.readyState === 0 && !process.env.MONGO_URL) {
      mongoose.connect(
        `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`,
        {
          useNewUrlParser: true,
        }
      );
      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', () => {
        console.log('MongoDb connected');
      });
    }
  }

  sensorFaultsFromToday() {
    return SensorFault.find({
      timestamp: {
        $gte: new Date() - 1000 * 60 * 60 * 24,
      },
    });
  }

  addMaintenanceSensor({ loc_x, loc_y, floor }) {
    return new SensorMaintenance({
      loc_x: loc_x,
      loc_y: loc_y,
      floor: floor,
    }).save();
  }

  getMaintenanceSensor({ loc_x, loc_y, floor }) {
    return SensorMaintenance.findOne({
      loc_x: loc_x,
      loc_y: loc_y,
      floor: floor,
    });
  }

  getAllMaintenanceSensors() {
    return SensorMaintenance.find();
  }

  removeMaintenanceSensor({ loc_x, loc_y, floor }) {
    return SensorMaintenance.deleteOne({
      loc_x: loc_x,
      loc_y: loc_y,
      floor: floor,
    });
  }

    /**
     * @description Gets the users from the MongoDB
     * @param {UserModel} user
     */
    getUsers(){
        return UserModel.find();
    }

    /**
     * @description Updates the password field of the user
     * @param {UserModel} user
     */
    async updateUserPassword(email,password) {
        await UserModel.findOneAndUpdate({email: email}, {$set:{password:password}})
        console.log("Password Changed")
        
    }


  getUserByEmail(email) {
    return UserModel.findOne({
      email: email,
    });
  }

  /**
   * @description Adds a new user to the MongoDB
   * @param {UserModel} user
   */
  addUser(user) {
    return UserModel.create(user)
      .then((user) => {
        console.log('User added');
      })
      .catch((err) => {
        if (err.code === 11000) {
          console.log('Email already in use');
          return;
        }
        console.log(err);
      });
  }

  /**
   * @description Gets the users from the MongoDB
   * @param {UserModel} user
   */
  getUsers() {
    return UserModel.find();
  }
}

module.exports = MongoDataSource;
