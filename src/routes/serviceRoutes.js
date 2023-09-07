const express = require('express');
const {
    getAllServices,
    deleteService,
    updateService,
    getServiceById,
    createService,
} = require("../controllers/servicesController");

const router = express.Router();

router.get('/', getAllServices);
router.post('/', createService);
router.get('/:id', getServiceById);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

module.exports = router;
