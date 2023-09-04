const express = require('express');
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController'); // Asegúrate de que la ruta sea la correcta

const router = express.Router();

// Obtener todas las categorías
router.get('/', getAllCategories);

// Obtener una categoría específica por ID
router.get('/:id', getCategoryById);

// Crear una nueva categoría
router.post('/', createCategory);

// Actualizar una categoría por ID
router.put('/:id', updateCategory);

// Eliminar una categoría por ID
router.delete('/:id', deleteCategory);

module.exports = router;
