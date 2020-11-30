const mongoose = require('mongoose');
const {
    SensorFault
} = require('../models/sensorfault')
const UserModel = require('../models/UserModel')
const MongoDataSource = require('../data_sources/MongoDataSource')
let mongodb = new MongoDataSource({})

beforeAll(async () => {
    const full_url = process.env.MONGO_URL.split('/').slice(0, -1).join('/') + '/' + global.MONGO_DB_NAME
    await mongoose.connect(full_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        poolSize: 20
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

beforeEach(async () => {
    mongodb = new MongoDataSource({})
    for (const key in mongoose.connection.collections) {
        await mongoose.connection.collections[key].deleteMany();
    }
})


test('test of reading the entry with timestamp', async () => {

    const sensorEntry = new SensorFault({
        loc_x: 10,
        loc_y: 5,
        floor: 3,
        timestamp: Date.now()
    })

    await sensorEntry.save();
    const entries = await mongodb.sensorFaultsFromToday();
    expect(entries[0].toObject()).toEqual(sensorEntry.toObject());

});

test('test of reading the entry with past timestamp', async () => {

    const sensorEntry = new SensorFault({
        loc_x: 10,
        loc_y: 5,
        floor: 3,
        timestamp: new Date("December 12, 2015 12:00:00")
    })

    await sensorEntry.save();
    const entries = await mongodb.sensorFaultsFromToday();
    expect(entries.length).toBe(0);

});

test('test of adding user to the mongodb through addUser() method', async () => {

    const testUser = new UserModel({
        email: 'test@gmail.com',
        password: '12345678Test'
    });

    const randomUser = new UserModel({
        email: 'randomUser@gmail.com',
        password: '12345678Test'
    });
    

    await mongodb.addUser(testUser);
    await mongodb.addUser(randomUser);
  
    const expected = await UserModel.findOne({email: 'test@gmail.com'})
    expect(expected.toObject()).toEqual(testUser.toObject());
    expect(expected.toObject()).not.toEqual(randomUser.toObject());
  

});

test('test of getting user from the mongodb through getUser() method', async () => {

    const testUser = new UserModel({
        email: 'test@gmail.com',
        password: '12345678Test'
    });

    const randomUser = new UserModel({
        email: 'randomUser@gmail.com',
        password: '12345678Test'
    });

    await testUser.save();

    const expected = await mongodb.getUsers();
    expect(expected[0].toObject()).toEqual(testUser.toObject());
    expect(expected[0].toObject()).not.toEqual(randomUser.toObject());

});



