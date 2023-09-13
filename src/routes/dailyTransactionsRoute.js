const express = require('express');
const { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/dailyTransactionsController.js'); // Asegúrate de que la ruta sea la correcta


const router = express.Router();

// Obtener todas las transacciones
router.get('/', getAllTransactions);

// Crear una nueva transacción
router.post('/', createTransaction);

// Obtener una transacción específica por ID
router.get('/:id', getTransactionById);

// Actualizar una transacción por ID
router.put('/:id', updateTransaction);

// Eliminar una transacción por ID
router.delete('/:id', deleteTransaction);

module.exports = router;
