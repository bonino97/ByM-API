const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Product = require('../models/Product');

const NAMESPACE = 'Product Controller';

const getAllProducts = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllProducts Method');
    try {
        const products = await Product.find().populate('supplier').populate('category');
        if (products.length === 0) return sendResponse(res, 404, 'No products found');
        return sendResponse(res, 200, 'Products retrieved successfully', { products });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllProducts Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getProductById = async (req, res) => {
    logging.info(NAMESPACE, 'GetProductById Method');
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('supplier').populate('category');
        if (!product) {
            return sendResponse(res, 404, 'Product not found');
        }
        return sendResponse(res, 200, 'Product retrieved successfully', { product });
    } catch (error) {
        logging.error(NAMESPACE, 'GetProductById Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const createProduct = async (req, res) => {
    logging.info(NAMESPACE, 'CreateProduct Method');
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        return sendResponse(res, 201, 'Product created successfully', { newProduct });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateProduct Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const updateProduct = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateProduct Method');
    try {
        const productId = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
        if (!updatedProduct) {
            return sendResponse(res, 404, 'Product not found');
        }
        return sendResponse(res, 200, 'Product updated successfully', { updatedProduct });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateProduct Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteProduct = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteProduct Method');
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return sendResponse(res, 404, 'Product not found');
        }
        return sendResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteProduct Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
