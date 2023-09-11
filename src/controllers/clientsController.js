const logging = require("../utils/logging");
const {sendResponse} = require('../utils/response');
const Client = require('../models/Client');

const NAMESPACE = 'Client Controller';

const getAllClients = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllClients Method');
    try {
        const clients = await Client.find();

        if (clients.length === 0) return sendResponse(res, 404, 'No clients found');

        return sendResponse(res, 200, 'Clients retrieved successfully', {clients});
    } catch(error){
        logging.error(NAMESPACE, 'GetAllClients Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getClientById = async (req, res) => {
    logging.info(NAMESPACE, 'GetClientById Method');
    try {
        const clientId = req.params.id;
        const client = await Client.findById(clientId);
        if (!client) {
            return sendResponse(res, 404, 'Client not found');
        }
        return sendResponse(res, 200, 'Client retrieved successfully', {client});
    } catch(error){
        logging.error(NAMESPACE, 'GetClientById Method', error);
        return sendResponse(res, 500, '', error);
    }
};  

const createClient = async (req, res) => {
    logging.info(NAMESPACE, 'CreateClient Method');
    try {
        const receivedClient = req.body;

        const newClient = new Client(receivedClient);

        if (!newClient) return sendResponse(res, 400, 'An error ocurred.');

        const savedClient = await newClient.save();

        return sendResponse(res, 201, 'Client created successfully', {client: savedClient});
    } catch(error){
        logging.error(NAMESPACE, 'CreateClient Method', error);
        return sendResponse(res, 500, '', error);
    }
}

const updateClient = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateClient Method');
    try {
        const clientId = req.params.id;
        const receivedClient = req.body;

        const updatedClient = await Client.findByIdAndUpdate(clientId, receivedClient, {new: true});

        if (!updatedClient) return sendResponse(res, 400, 'An error ocurred.');

        return sendResponse(res, 200, 'Client updated successfully', {client: updatedClient});
    }
    catch(error){
        logging.error(NAMESPACE, 'UpdateClient Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteClient = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteClient Method');
    try {
        const clientId = req.params.id;
        const deletedClient = await Client.findByIdAndDelete(clientId);

        if (!deletedClient) return sendResponse(res, 400, 'An error ocurred.');

        return sendResponse(res, 200, 'Client deleted successfully');
    } catch(error){
        logging.error(NAMESPACE, 'DeleteClient Method', error);
        return sendResponse(res, 500, '', error);
    }
}

module.exports = {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};
