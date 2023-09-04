const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid').v4;
const dotenv = require('dotenv');

const logging = require('../utils/logging');
const sendResponse = require('../utils/response');

const ROLES_ENUM = require('../enum/roles.enum');
const User = require('../models/User');
const Role = require('../models/Role');

const NAMESPACE = 'Auth Controller';

// Register a new user
exports.signUp = async (req, res) => {
    logging.info(NAMESPACE, 'SignUp Method');
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        const role = await Role.findOne({ name: ROLES_ENUM['SUPER_ADMIN'] });
        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return sendResponse(res, 400, 'Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        await newUser.save();
        return sendResponse(res, 201, 'User created successfully', newUser);
    } catch (error) {
        logging.error(NAMESPACE, 'SignUp Method', error);
        return sendResponse(res, 500, '', error);
    }
};

// Sign in
exports.signIn = async (req, res) => {
    logging.info(NAMESPACE, 'SignIn Method');
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }

        if (!user.isVerified) {
            return sendResponse(res, 403, 'Email not verified. Please verify your email first.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 400, 'Invalid credentials');
        }

        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                tenant: user.tenant,
            },
            dotenv.config().parsed.JWT_SECRET_KEY,
            {
                expiresIn: '240h',
            }
        );

        const userWithRoleAndTenant = await User.findById(user.id)
            .select('-password -verifyCode -verifyCodeExpires')
            .populate('role')
            .select('name permissions')

        return sendResponse(res, 200, 'Logged in successfully', {
            accessToken,
            user: userWithRoleAndTenant,
        });
    } catch (error) {
        logging.error(NAMESPACE, 'SignIn Method', error);
        return sendResponse(res, 500, '', error);
    }
};

// Sign in using token
exports.signInUsingToken = async (req, res) => {
    logging.info(NAMESPACE, 'SignInUsingToken Method');
    try {
        const accessToken = req.headers.authorization?.split(' ')[1] ?? '';

        if (!accessToken) return sendResponse(res, 401, 'Unauthorized');

        const decodedToken = jwt.verify(
            accessToken,
            dotenv.config().parsed.JWT_SECRET_KEY
        );
        const userId = decodedToken.userId;

        const user = await User.findById(userId).populate('role');

        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }

        return sendResponse(res, 200, 'User found', {
            accessToken,
            user,
        });
    } catch (error) {
        logging.error(NAMESPACE, 'SignInUsingToken Method', error);
        return sendResponse(res, 500, '', error);
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    logging.info(NAMESPACE, 'ForgotPassword Method');
    try {
        const email = req.body.email;

        const user = await User.findOne({ email });

        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }

        await user.save();

        return sendResponse(res, 200, 'Password reset token generated', {
            token: user.verifyCode,
        });
    } catch (error) {
        logging.error(NAMESPACE, 'ForgotPassword Method', error);
        return sendResponse(res, 500, '', error);
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    logging.info(NAMESPACE, 'ResetPassword Method');
    try {
        const token = req.body.token;
        const newPassword = req.body.newPassword;

        const user = await User.findOne({});

        if (!user) {
            return sendResponse(res, 400, 'Token is invalid or has expired');
        }

        await user.save();

        return sendResponse(res, 200, 'Password reset successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'ResetPassword Method', error);
        return sendResponse(res, 500, '', error);
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    logging.info(NAMESPACE, 'VerifyEmail Method');
    try {
        const token = req.body.token;

        const user = await User.findOne({ verifyCode: token });

        if (!user) {
            return sendResponse(res, 400, 'Invalid verification token');
        }

        if (user.verifyCodeExpires && user.verifyCodeExpires < new Date()) {
            return sendResponse(res, 400, 'Verification token has expired');
        }

        await user.save();

        return sendResponse(res, 200, 'Email verified successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'VerifyEmail Method', error);
        return sendResponse(res, 500, '', error);
    }
};
