const express = require('express');
const {
    getAllCheques,
    getChequeById,
    createCheque,
    updateCheque,
    deleteCheque
} = require('../controllers/checkController'); // Asegúrate de que la ruta sea la correcta

const router = express.Router();

// Obtener todos los cheques
router.get('/', getAllCheques);

// Obtener un cheque específico por ID
router.get('/:id', getChequeById);

// Crear un nuevo cheque
router.post('/', createCheque);

// Actualizar un cheque por ID
router.put('/:id', updateCheque);

// Eliminar un cheque por ID
router.delete('/:id', deleteCheque);

module.exports = router;
