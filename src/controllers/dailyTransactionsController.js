const logging = require("../utils/logging");
const {sendResponse} = require('../utils/response');
const Transaction = require('../models/DayliTransactions');

const NAMESPACE = 'DailyTransactions Controller';

const getAllTransactions = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllClients Method');
    try {
        const transaction = await Transa.find();
        if (transaction.length === 0) return sendResponse(res, 404, 'No transactions found');
        return sendResponse(res, 200, 'transactions retrieved successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'GetAllClients Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getTransactionById = async (req, res) => {
    logging.info(NAMESPACE, 'GetClientById Method');
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction retrieved successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'GetClientById Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const createTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'CreateClient Method');
    try {
        const receivedTransaction = req.body;
        const newTransaction = new Transaction(receivedTransaction);
        if (!newTransaction) return sendResponse(res, 400, 'An error ocurred.');
        const transaction = await newTransaction.save();
        return sendResponse(res, 201, 'transaction created successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'CreateClient Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const updateTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateClient Method');
    try {
        const transactionId = req.params.id;
        const receivedTransaction = req.body;
        const transaction = await Transaction.findByIdAndUpdate(transactionId, receivedTransaction, {new: true});
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction updated successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'UpdateClient Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const deleteTransaction = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteClient Method');
    try {
        const transactionId = req.params.id;
        const transaction = await Transaction.findByIdAndDelete(transactionId);
        if (!transaction) return sendResponse(res, 404, 'transaction not found');
        return sendResponse(res, 200, 'transaction deleted successfully', {transaction});
    } catch(error){
        logging.error(NAMESPACE, 'DeleteClient Method', error);
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
