const UserModel = require('../models/UserModel')
const mongoose = require('mongoose');
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

test('test a matching password', async () => {

   const testUser = new UserModel({
       email: 'test@gmail.com',
       password: '12345678Test'
   });

   await testUser.save()
   
   const expected = await UserModel.findOne({email: 'test@gmail.com'})
    expected.comparePassword('12345678Test', function (err, isMatch) {
        if (err) throw err;
        expect(isMatch).toBe(true)
    });
});

test('test a failing password', async () => {

   const testUser = new UserModel({
       email: 'test@gmail.com',
       password: '12345678Test'
   });

   await testUser.save()
   
   const expected = await UserModel.findOne({email: 'test@gmail.com'})
    expected.comparePassword('randompass553', function (err, isMatch) {
        if (err) throw err;
        expect(isMatch).toBe(false)
    });
});

test('test UserModel -> success', async () => {

   const testUser = new UserModel({
       email: 'test@gmail.com',
       password: '12345678Test'
   });

   const actual = await testUser.save()
   
   const expected = await UserModel.findOne({email: 'test@gmail.com'})
   expect(expected.toObject()).toEqual(actual.toObject())
});

test('test UserModel -> null', async () => {

   const expected = await UserModel.findOne({email: 'test@gmail.com'})
   expect(expected).toBe(null)
});

test('test UserModel -> fail', async () => {

   const testUser = new UserModel({
       email: 'test@gmail.com',
       password: '12345678Test'
   });

   const randomUser = new UserModel({
       email: 'randomUser@gmail.com',
       password: '12345678Test'
   });

   const actual = await testUser.save()
   const expected = await randomUser.save()
   expect(expected).not.toEqual(actual)
});

test('UserModel validates email as required', async () => {

   const testUser = new UserModel({
       password: '12345678Test'
   });

   await expect(testUser.save()).rejects.toThrow(/validation failed.*email.*is required.*/i);
});

test('UserModel validates password as required', async () => {

    const testUser = new UserModel({
        email: 'test@gmail.com',
    });

    await expect(testUser.save()).rejects.toThrow(/validation failed.*password.*is required.*/i);
});