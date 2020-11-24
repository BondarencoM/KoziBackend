require('dotenv').config({
    path: '../.env'
})
const questions = require('./questions')
const {
    prompt
} = require('inquirer')
const program = require('commander')
const MongoDataSource = require('../data_sources/MongoDataSource')
const MONGO_CONFIG = {
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_DB: process.env.MONGO_DB,
    MONGO_HOST: process.env.MONGO_HOST,
}
let mongodb = new MongoDataSource(MONGO_CONFIG)


program.version('1.0.0').description('User Management System')

program.command('add').alias('a').description('Add a user')
    .action(async () => {
        const users = await mongodb.getUsers()
        if (users.length > 0) {
            console.log("User already added")
        } else {
            prompt(questions).then(answers => {
                mongodb.addUser(answers)
            });
        }
    });
program.parse(process.argv)