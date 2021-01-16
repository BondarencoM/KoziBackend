const mongoose = require('mongoose');
const { SensorFault } = require('../models/sensorfault');
const UserModel = require('../models/UserModel');
const MongoDataSource = require('../data_sources/MongoDataSource');
const { SensorMaintenance } = require('../models/SensorMaintenance');
let mongodb = new MongoDataSource({});

beforeAll(async () => {
  const full_url =
    process.env.MONGO_URL.split('/').slice(0, -1).join('/') +
    '/' +
    global.__MONGO_DB_NAME__;
  await mongoose.connect(full_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    poolSize: 20,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  mongodb = new MongoDataSource({});
  for (const key in mongoose.connection.collections) {
    await mongoose.connection.collections[key].deleteMany();
  }
});

//#region Faulty Sensor Tests
test('test of reading the entry with timestamp', async () => {
  const sensorEntry = new SensorFault({
    loc_x: 10,
    loc_y: 5,
    floor: 3,
    timestamp: Date.now(),
  });

  await sensorEntry.save();
  const entries = await mongodb.sensorFaultsFromToday();
  expect(entries[0].toObject()).toEqual(sensorEntry.toObject());
});

test('test of reading the entry with past timestamp', async () => {
  const sensorEntry = new SensorFault({
    loc_x: 10,
    loc_y: 5,
    floor: 3,
    timestamp: new Date('December 12, 2015 12:00:00'),
  });

  await sensorEntry.save();
  const entries = await mongodb.sensorFaultsFromToday();
  expect(entries.length).toBe(0);
});

//#endregion
//#region User and Auth Tests
test('test of adding user to the mongodb through addUser() method', async () => {
  const testUser = new UserModel({
    email: 'test@gmail.com',
    password: '12345678Test',
  });

  const randomUser = new UserModel({
    email: 'randomUser@gmail.com',
    password: '12345678Test',
  });

  await mongodb.addUser(testUser);

  const expected = await UserModel.findOne({ email: 'test@gmail.com' });
  expect(expected.toObject()).toEqual(testUser.toObject());
  expect(expected.toObject()).not.toEqual(randomUser.toObject());
});

test('test of getting user from the mongodb through getUser() method', async () => {
  const testUser = new UserModel({
    email: 'test@gmail.com',
    password: '12345678Test',
  })

  const randomUser = new UserModel({
    email: 'randomUser@gmail.com',
    password: '12345678Test',
  })

  await testUser.save();

  const expected = await mongodb.getUsers()
  expect(expected[0].toObject()).not.toEqual(randomUser.toObject())
  expect(expected[0].toObject()).toEqual(testUser.toObject())
})

test('test of updateUserPassword method - providing new password', async () => {

    const testUser = new UserModel({
        email: 'test2@Isaac.nl',
        password: '12345678Test'
    })

    await testUser.save()

    await mongodb.updateUserPassword(testUser.email, "87654321Test")
    const expected = await UserModel.findOne({ email: testUser.email })
    expect(await expected.comparePasswordAsync('87654321Test')).toBe(true)

})

test('test of updateUserPassword method - providing old password', async () => {

    const testUser = new UserModel({
        email: 'test2@Isaac.nl',
        password: '12345678Test'
    })

    await testUser.save()

    await mongodb.updateUserPassword(testUser.email, "87654321Test")
    const expected = await UserModel.findOne({ email: testUser.email })
    expect(await expected.comparePasswordAsync('12345678Test')).toBe(false)

})

test('test of getUserByEmail method - matching email', async () => {

    const testUser = new UserModel({
        email: 'test2@Isaac.nl',
        password: '12345678Test'
    })

    await testUser.save()

    const expected = await mongodb.getUserByEmail(testUser.email)
    expect(expected.email).toEqual(testUser.email)

})

test('test of getUserByEmail method - wrong email', async () => {

    const testUser = new UserModel({
        email: 'test2@Isaac.nl',
        password: '12345678Test'
    })

    const testUser2 = new UserModel({
        email: 'test11@Isaac.nl',
        password: '12345678Test'
    })

    await testUser.save()
    await testUser2.save()

    const expected = await mongodb.getUserByEmail(testUser2.email)
    expect(expected.email).not.toEqual(testUser.email)

})



//#endregion

//#region Maintenance Sensor Tests
test('should remove an existing sensor from the database', async () => {
  const testingMaintenanceSensor = {
    loc_x: 12,
    loc_y: 12,
    floor: 1,
  };
  await new SensorMaintenance(testingMaintenanceSensor).save()

  await mongodb.removeMaintenanceSensor(testingMaintenanceSensor)

  expect(await SensorMaintenance.count()).toEqual(0)
});

test('should get an existing sensor from the database', async () => {
  const testingMaintenanceSensor = {
    loc_x: 12,
    loc_y: 12,
    floor: 1,
  }
  await new SensorMaintenance(testingMaintenanceSensor).save()

  const expectedMaintenanceSensor = await mongodb.getMaintenanceSensor(
    testingMaintenanceSensor
  )

  expect(testingMaintenanceSensor.loc_x).toEqual(
    expectedMaintenanceSensor.loc_x
  )
  expect(testingMaintenanceSensor.loc_y).toEqual(
    expectedMaintenanceSensor.loc_y
  )
  expect(testingMaintenanceSensor.floor).toEqual(
    expectedMaintenanceSensor.floor
  )
})

test('should get all sensors from the database', async () => {
  const maintenanceSensor1 = await new SensorMaintenance({
    loc_x: 11,
    loc_y: 12,
    floor: 3,
  }).save()
  await new SensorMaintenance({
    loc_x: 12,
    loc_y: 12,
    floor: 3,
  }).save()
  await new SensorMaintenance({
    loc_x: 13,
    loc_y: 12,
    floor: 3,
  }).save()

  const expectedResult = await mongodb.getAllMaintenanceSensors()

  expect(expectedResult.length).toEqual(await SensorMaintenance.count())
  expect(expectedResult[0].loc_x).toEqual(maintenanceSensor1.loc_x)
  expect(expectedResult[0].loc_y).toEqual(maintenanceSensor1.loc_y)
  expect(expectedResult[0].floor).toEqual(maintenanceSensor1.floor)
})

test('should add maintenance sensor into the database', async () => {
  const newMaintenanceSensor = {
    loc_x: 12,
    loc_y: 12,
    floor: 1,
  }
  await mongodb.addMaintenanceSensor(newMaintenanceSensor)

  const expectedMaintenanceSensor = await SensorMaintenance.findOne({
    loc_x: 12,
    loc_y: 12,
    floor: 1,
  })

  expect(newMaintenanceSensor.loc_x).toEqual(expectedMaintenanceSensor.loc_x)
  expect(newMaintenanceSensor.loc_y).toEqual(expectedMaintenanceSensor.loc_y)
  expect(newMaintenanceSensor.floor).toEqual(expectedMaintenanceSensor.floor)
});

//#endregion

