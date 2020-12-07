const {validateEmail,validatePassword} = require('./validation')
/**
 * User Questions
 */
const questions = [{
        type: 'input',
        name: 'email',
        message: 'Enter the email:',
        validate: validateEmail
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter the password:',
        mask: "*",
        validate: validatePassword
    }
]

module.exports = questions