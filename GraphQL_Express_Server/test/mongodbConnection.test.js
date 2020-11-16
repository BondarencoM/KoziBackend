const { isType } = require('graphql');
const mongoose = require('mongoose');
const { SensorFault } = require('../models/sensorfault')

beforeAll(async () => {
    const full_url = process.env.MONGO_URL.split('/').slice(0, -1).join('/') + '/' + global.MONGO_DB_NAME
    await mongoose.connect(full_url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        poolSize: 20
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})

beforeEach(async () => {
            for (const key in mongoose.connection.collections) {
                await mongoose.connection.collections[key].deleteMany();
            }
        })

test('test of reading the entry', async () => {
  
    var sensorEntry = new SensorFault({
        loc_x:10,
        loc_y:5,
        floor:3
    })

    await sensorEntry.save();
    var expectedEntry = await SensorFault.find();
    expect(sensorEntry).toEqual(expectedEntry);
});

    