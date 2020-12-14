const validator = require("email-validator")
/**
 * @description Check the input of email
 * @param {Email} input 
 * @returns true if the input is correct otherwise returns the error message
 */
const validateEmail = (input) => {
    if (input === "") {
        return 'Email field should not be empty'
    } else if (!(validator.validate(input))) {
        return 'Please enter a valid email'
    } else if (!checkDomain(input)) {
        return 'Wrong domain name'
    }
    return true;
}

/**
 * @description Check the input of password
 * @param {Password} input 
 * @returns true if the input is correct otherwise returns the error message
 */
const validatePassword = (input) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (input === "") {
        return 'Password field should not be empty'
    }else if(!(re.test(input))){
        return 'Password should be minimum eight characters, at least one letter and one number'
    }
    return true;
}

/**
 * @description Checks the domain of the email
 * @param {Email} input 
 * @return true if matches the domain otherwise false
 */
function checkDomain(input) {
    if (input.indexOf("@Isaac.nl", input.length - "@Isaac.nl".length) !== -1) {
        return true
    }
    return false;
}

module.exports = {
    validatePassword,
    validateEmail,
    checkDomain
}