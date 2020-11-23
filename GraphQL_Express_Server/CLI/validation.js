/**
 * @description Check the input of email
 * @param {Email} input 
 * @returns true if the input is correct otherwise returns the error message
 */
const validateEmail = (input) => {
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (input === "") {
        return 'Email field should not be empty'
    } else if (!(re.test(input))) {
        return 'Please enter a valid email'
    }
    return true;
}

/**
 * @description Check the input of password
 * @param {Email} input 
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

module.exports = {validatePassword, validateEmail}