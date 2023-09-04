const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Order = require('../models/Order');

const NAMESPACE = 'Order Controller';

const getAllOrders = async (req, res) => {
    logging.info(NAMESPACE, 'GetAllOrders Method');
    try {
        const orders = await Order.find().populate('products').populate('client').populate('seller');

        if (orders.length === 0) return sendResponse(res, 404, 'No orders found');

        return sendResponse(res, 200, 'Orders retrieved successfully', { orders });
    } catch (error) {
        logging.error(NAMESPACE, 'GetAllOrders Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const getOrderById = async (req, res) => {
    logging.info(NAMESPACE, 'GetOrderById Method');
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate('products').populate('client').populate('seller');

        if (!order) {
            return sendResponse(res, 404, 'Order not found');
        }

        return sendResponse(res, 200, 'Order retrieved successfully', { order });
    } catch (error) {
        logging.error(NAMESPACE, 'GetOrderById Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const createOrder = async (req, res) => {
    logging.info(NAMESPACE, 'CreateOrder Method');
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        return sendResponse(res, 201, 'Order created successfully', { newOrder });
    } catch (error) {
        logging.error(NAMESPACE, 'CreateOrder Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const updateOrder = async (req, res) => {
    logging.info(NAMESPACE, 'UpdateOrder Method');
    try {
        const orderId = req.params.id;
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            req.body,
            { new: true }
        ).populate('products').populate('client').populate('seller');

        if (!updatedOrder) {
            return sendResponse(res, 404, 'Order not found');
        }

        return sendResponse(res, 200, 'Order updated successfully', { updatedOrder });
    } catch (error) {
        logging.error(NAMESPACE, 'UpdateOrder Method', error);
        return sendResponse(res, 500, '', error);
    }
};

const deleteOrder = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteOrder Method');
    try {
        const orderId = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return sendResponse(res, 404, 'Order not found');
        }

        return sendResponse(res, 200, 'Order deleted successfully');
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteOrder Method', error);
        return sendResponse(res, 500, '', error);
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
