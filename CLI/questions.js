const {validateEmail,validatePassword} = require('./validation')
/**
 * Questions for creating user
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

/**
 * Questions for account verification
 */
const verification_questions = [{
        type: 'input',
        name: 'email',
        message: 'Enter the email:',
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter the password:',
        mask: "*",
        validate: validatePassword
    }
]

/**
 * Questions for changing password
 */
const password_questions = [{
        type: 'password',
        name: 'password',
        message: 'Enter the new password:',
        mask: "*",
        validate: validatePassword
    },
]

module.exports = {questions, verification_questions,password_questions}