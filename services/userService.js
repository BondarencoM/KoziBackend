const jwt = require('jsonwebtoken');

async function login(_, {email, password}, { dataSources }) {
    const user = await dataSources.mongodb.getUserByEmail(email);

    if (user) {
        if(await user.comparePasswordAsync(password)){
            const accessToken = jwt.sign({ email: user.email}, process.env.JWT_SIGNING_SECRET);

            return {accessToken};
        }
    }
    return ({
        'error' : 'Email or password is incorrect'
    });
}

module.exports = {login}
