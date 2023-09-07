const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const User = require('../models/User');

const NAMESPACE = 'User Controller';

const getAllUsers = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllUsers Method');
    try {
        const users = await User.find();
        if (users.length === 0) return sendResponse(res, 404, 'No users found');

        return sendResponse(res, 200, 'Users retrieved successfully', { users });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllUsers Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getUserById = async (req, res) => {
    logging.info(NAMESPACE, 'GetUserById Method');
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }
        return sendResponse(res, 200, 'User retrieved successfully', { user });
    } catch (error) {
        logging.error(NAMESPACE, 'GetUserById Method', error);
        return sendResponse(res, 500, '', error);
    }
};
const createUser = async (req, res) => {
    logging.info(NAMESPACE, 'CreateUser Method');
    const { firstName, lastName } = req.body;
    
    try {
        // VERIFICAR SI EL USUARIO YA EXISTE POR NOMBRE Y APELLIDOS
        const verificarUser = await User.findOne({ firstName, lastName });

        if (verificarUser) {
            console.log('El usuario ya existe');
            return sendResponse(res, 400, 'El usuario ya existe');
        }

        // SI EL USUARIO NO EXISTE, CREARLO
        const newUser = new User(req.body);
        await newUser.save();
        return sendResponse(res, 201, 'Usuario creado exitosamente', { newUser });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateUser Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const updateUser = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateUser Method');
    try {
        const userId = req.params.id;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return sendResponse(res, 404, 'User not found');
        }
        return sendResponse(res, 200, 'User updated successfully', { updatedUser });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateUser Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteUser = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteUser Method');
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return sendResponse(res, 404, 'User not found');
        }
        return sendResponse(res, 200, 'User deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteUser Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
