const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Category = require('../models/Category');
const { findOne } = require('../models/Service');

const NAMESPACE = 'Category Controller';

const getAllCategories = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllCategories Method');
    try {
        const categories = await Category.find();
        if (categories.length === 0) return sendResponse(res, 404, 'No categories found');
        return sendResponse(res, 200, 'Categories retrieved successfully', { categories });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllCategories Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getCategoryById = async (req, res) => {
    logging.info(NAMESPACE, 'GetCategoryById Method');
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        if (!category) {
            return sendResponse(res, 404, 'Category not found');
        }
        return sendResponse(res, 200, 'Category retrieved successfully', { category });
    } catch (error) {
        logging.error(NAMESPACE, 'GetCategoryById Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const createCategory = async (req, res) => {
    logging.info(NAMESPACE, 'CreateCategory Method');
    try {
        const newCategory = new Category(req.body);
        // VERIFICAR SI LA CATEGORIA YA EXISTE POR NOMBRE
        const verifyCategory = await findOne({ name: newCategory.name });
        if (verifyCategory) {
            return sendResponse(res, 400, 'Category is already registered');
        } else {
            await newCategory.save();
            return sendResponse(res, 201, 'Category created successfully', { newCategory });
        }
    } catch (error) {
        logging.error(NAMESPACE, 'CreateCategory Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const updateCategory = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateCategory Method');
    try {
        const categoryId = req.params.id;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
        if (!updatedCategory) {
            return sendResponse(res, 404, 'Category not found');
        }
        return sendResponse(res, 200, 'Category updated successfully', { updatedCategory });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateCategory Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteCategory = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteCategory Method');
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return sendResponse(res, 404, 'Category not found');
        }
        return sendResponse(res, 200, 'Category deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteCategory Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
