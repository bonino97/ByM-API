const logging = require("../utils/logging");
const {sendResponse} = require('../utils/response');
const Transaction = require('../models/DailyTransactions');

const NAMESPACE = 'DailyTransactions Controller';

const getAllTransactions = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllTransactions Method');
    try {
        const transaction = await Transaction.find();
        if (transaction.length === 0) return sendResponse(res, 404, 'No transactions found');
        return sendResponse(res, 200, 'transactions retrieved successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'GetAllTransactions Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getTransactionById = async (req, res) => {
    logging.info(NAMESPACE, 'getTransactionById Method');
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction retrieved successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, ' getTransactionById Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const createTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'CreateTransaction Method');
    try {
        const receivedTransaction = req.body;
        const newTransaction = new Transaction(receivedTransaction);
        if (!newTransaction) return sendResponse(res, 400, 'An error ocurred.');
        const transaction = await newTransaction.save();
        return sendResponse(res, 201, 'transaction created successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'CreateTransaction Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const updateTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateTransaction Method');
    try {
        const transactionId = req.params.id;
        const receivedTransaction = req.body;
        const transaction = await Transaction.findByIdAndUpdate(transactionId, receivedTransaction, {new: true});
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction updated successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'UpdateTransaction Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const deleteTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteTransaction Method');
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction deleted successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'DeleteTransaction Method', error);
        return sendResponse(res, 500, '', error);
    }
}

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
