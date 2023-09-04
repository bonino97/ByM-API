const express = require('express');
const {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require('../controllers/supplierController'); // Asegúrate de que la ruta sea la correcta

const router = express.Router();

// Obtener todos los proveedores
router.get('/', getAllSuppliers);

// Obtener un proveedor específico por ID
router.get('/:id', getSupplierById);

// Crear un nuevo proveedor
router.post('/', createSupplier);

// Actualizar un proveedor por ID
router.put('/:id', updateSupplier);

// Eliminar un proveedor por ID
router.delete('/:id', deleteSupplier);

module.exports = router;
