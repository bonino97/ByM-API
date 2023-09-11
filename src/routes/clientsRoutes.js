const express = require('express');
const {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} = require('../controllers/clientsController');
const router = express.Router();

// Rutas para los clientes
router.post('/', createClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
