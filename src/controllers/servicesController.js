const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Service = require('../models/Service');

const NAMESPACE = 'Service Controller';

const createService = async (req, res) => {
    logging.info(NAMESPACE, 'CreateService Method');
    try {
        const newService = new Service(req.body);
        await newService.save();
        return sendResponse(res, 201, 'Service created successfully', { newService });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateService Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getAllServices = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllServices Method');
    try {
        const services = await Service.find();
        if (services.length === 0) return sendResponse(res, 404, 'No services found');
        return sendResponse(res, 200, 'Services retrieved successfully', { services });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllServices Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getServiceById = async (req, res) => {
    logging.info(NAMESPACE, 'GetServiceById Method');
    try {
        const serviceId = req.params.id;
        if (!serviceId) return sendResponse(res, 400, 'Service ID is required');
        const service = await Service.findById(serviceId);
        if (!service) return sendResponse(res, 404, 'Service not found');
        return sendResponse(res, 200, 'Service retrieved successfully', { service });

    }catch(error){
        logging.error(NAMESPACE, 'GetServiceById Method', error);
        return sendResponse(res, 500, '', error);

    }
};

const updateService = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateService Method');
    try {
        const serviceId = req.params.id;
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            req.body,
            { new: true }
        );
        if (!updatedService) {
            return sendResponse(res, 404, 'Service not found');
        }
        return sendResponse(res, 200, 'Service updated successfully', { updatedService });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateService Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteService = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteService Method');
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return sendResponse(res, 404, 'Service not found');
        }
        return sendResponse(res, 200, 'Service deleted successfully', { deletedService });
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteService Method', error);
        return sendResponse(res, 500, '', error);
    }
};


module.exports = {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};
