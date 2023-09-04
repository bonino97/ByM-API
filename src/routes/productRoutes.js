const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController'); // Asegúrate de que la ruta sea la correcta

const router = express.Router();

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto específico por ID
router.get('/:id', getProductById);

// Crear un nuevo producto
router.post('/', createProduct);

// Actualizar un producto por ID
router.put('/:id', updateProduct);

// Eliminar un producto por ID
router.delete('/:id', deleteProduct);

module.exports = router;
