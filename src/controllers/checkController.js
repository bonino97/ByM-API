const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Cheque = require('../models/Check');

const NAMESPACE = 'Cheque Controller';

const getAllCheques = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllCheques Method');
    try {
        const cheques = await Cheque.find();
        if (cheques.length === 0) return sendResponse(res, 404, 'No cheques found');
        return sendResponse(res, 200, 'Cheques retrieved successfully', { cheques });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllCheques Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getChequeById = async (req, res) => {
    logging.info(NAMESPACE, 'GetChequeById Method');
    try {
        const chequeId = req.params.id;
        const cheque = await Cheque.findById(chequeId);
        if (!cheque) {
            return sendResponse(res, 404, 'Cheque not found');
        }
        return sendResponse(res, 200, 'Cheque retrieved successfully', { cheque });
    } catch (error) {
        logging.error(NAMESPACE, 'GetChequeById Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const createCheque = async (req, res) => {
    logging.info(NAMESPACE, 'CreateCheque Method');

    try {
        const { chequeNumber, bank, amount, drawer, deliveredBy, expiredDate, cuit, status, bankPlace } = req.body;

        // Verificar si el cheque ya existe por número o alguna otra condición que consideres
        const existingCheque = await Cheque.findOne({ chequeNumber });

        if (existingCheque) {
            // Si el cheque ya existe, devuelve una respuesta de conflicto (código 409)
            return sendResponse(res, 409, 'Cheque already exists with the same number');
        }

        // Si el cheque no existe, crea un nuevo cheque
        const newCheque = new Cheque({
            chequeNumber,
            bank,
            amount,
            drawer,
            deliveredBy,
            expiredDate,
            cuit,
            status,
            bankPlace,
        });

        await newCheque.save();
        return sendResponse(res, 201, 'Cheque created successfully', { newCheque });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateCheque Method', error);
        return sendResponse(res, 500, 'Internal Server Error', error);
    }
};

const updateCheque = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateCheque Method');
    try {
        const chequeId = req.params.id;
        const updatedCheque = await Cheque.findByIdAndUpdate(chequeId, req.body, { new: true });
        if (!updatedCheque) {
            return sendResponse(res, 404, 'Cheque not found');
        }
        return sendResponse(res, 200, 'Cheque updated successfully', { updatedCheque });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateCheque Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteCheque = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteCheque Method');
    try {
        const chequeId = req.params.id;
        const deletedCheque = await Cheque.findByIdAndDelete(chequeId);
        if (!deletedCheque) {
            return sendResponse(res, 404, 'Cheque not found');
        }
        return sendResponse(res, 200, 'Cheque deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteCheque Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllCheques,
    getChequeById,
    createCheque,
    updateCheque,
    deleteCheque,
};
