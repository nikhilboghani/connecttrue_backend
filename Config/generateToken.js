const jwt = require('jsonwebtoken');

const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '130d'
    })
}

module.exports = generateToken; 