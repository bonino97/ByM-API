const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const logging = require('../utils/logging');
const sendResponse = require('../utils/sendResponse');

dotenv.config();

const NAMESPACE = 'Middleware';

const decodeToken = async (req, res, next) => {
    logging.info(NAMESPACE, `Decode Token Middleware`);

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
        return sendResponse(res, 401, 'Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.locals.jwt = decoded;
        next();
    } catch (error) {
        return sendResponse(res, 401, 'Decoding token failed.');
    }
};

module.exports = {
    decodeToken
};
