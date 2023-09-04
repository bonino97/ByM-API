const express = require('express');
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController'); // Asegúrate de que la ruta sea la correcta

const router = express.Router();

// Obtener todos los pedidos
router.get('/', getAllOrders);

// Obtener un pedido específico por ID
router.get('/:id', getOrderById);

// Crear un nuevo pedido
router.post('/', createOrder);

// Actualizar un pedido por ID
router.put('/:id', updateOrder);

// Eliminar un pedido por ID
router.delete('/:id', deleteOrder);

module.exports = router;
