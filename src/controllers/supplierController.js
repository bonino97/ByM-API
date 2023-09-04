const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Supplier = require('../models/Supplier');

const NAMESPACE = 'Supplier Controller';

const getAllSuppliers = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllSuppliers Method');
    try {
        const suppliers = await Supplier.find().populate('products');

        if (suppliers.length === 0) return sendResponse(res, 404, 'No suppliers found');

        return sendResponse(res, 200, 'Suppliers retrieved successfully', { suppliers });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllSuppliers Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getSupplierById = async (req, res) => {
    logging.info(NAMESPACE, 'GetSupplierById Method');
    try {
        const supplierId = req.params.id;
        const supplier = await Supplier.findById(supplierId).populate('products');

        if (!supplier) {
            return sendResponse(res, 404, 'Supplier not found');
        }
        return sendResponse(res, 200, 'Supplier retrieved successfully', { supplier });
    } catch (error) {
        logging.error(NAMESPACE, 'GetSupplierById Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const createSupplier = async (req, res) => {
    logging.info(NAMESPACE, 'CreateSupplier Method');
    try {
        const newSupplier = new Supplier(req.body);
        await newSupplier.save();
        return sendResponse(res, 201, 'Supplier created successfully', { newSupplier });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateSupplier Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const updateSupplier = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateSupplier Method');
    try {
        const supplierId = req.params.id;
        const updatedSupplier = await Supplier.findByIdAndUpdate(
            supplierId,
            req.body,
            { new: true }
        ).populate('products');

        if (!updatedSupplier) {
            return sendResponse(res, 404, 'Supplier not found');
        }
        return sendResponse(res, 200, 'Supplier updated successfully', { updatedSupplier });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateSupplier Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteSupplier = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteSupplier Method');
    try {
        const supplierId = req.params.id;
        const deletedSupplier = await Supplier.findByIdAndDelete(supplierId);

        if (!deletedSupplier) {
            return sendResponse(res, 404, 'Supplier not found');
        }
        return sendResponse(res, 200, 'Supplier deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteSupplier Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};
