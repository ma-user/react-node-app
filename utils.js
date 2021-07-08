const jwt = require('jsonwebtoken');

function generateToken(user) {
    if(!user) {
        return null;
    }

    return jwt.sign({user}, "jwtSecret", {
        expiresIn: 300
    });
}

function getCleanUser(user) {
    if(!user) {
        return null;
    }

    return {
        email: user.email,
        password: user.password
    };
}

module.exports = { generateToken, getCleanUser }