require('dotenv').config({
    path: '../.env'
})
const {
    questions
} = require('./questions')
const {
    verification_questions
} = require('./questions')
const {
    password_questions
} = require('./questions')

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
    .action(() => {
        prompt(questions).then(answers => {
            mongodb.addUser(answers)
        });
    });

program.command('password').alias('p').description('Change password')
    .action(() => {
        prompt(verification_questions).then(async answers => {
            const user = await mongodb.getUserByEmail(answers.email);
            if (user) {
                if (await user.comparePasswordAsync(answers.password)) {
                    console.log("Account Verified")
                    prompt(password_questions).then(async p_answers => {
                        if (await user.comparePasswordAsync(p_answers.password)) {
                            console.log("New password should be different from old password")
                        } else {
                            await mongodb.updateUserPassword(answers.email, p_answers.password)
                        }

                    })
                } else {
                    console.log('Email or password is incorrect')
                }
            }
            else {
                console.log('Email or password is incorrect')
            }

        });
    });

program.parse(process.argv)