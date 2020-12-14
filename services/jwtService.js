const jwt = require('jsonwebtoken');

const verifyJwt = (token) => {
    try{
        let user = jwt.verify(token, process.env.JWT_SIGNING_SECRET);
        if(user){
            return user;
        }
    }
    catch(e){
        console.log(e);
        return null;
    }

    return null;
}

module.exports = {verifyJwt}
