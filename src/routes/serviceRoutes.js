const express = require('express');
const {
    getAllServicesWithOwners,
    getServiceByIdWithOwnersAndVehicle,
    createServiceWithOwnerAndVehicle,
    updateServiceWithOwnerAndVehicle,
    deleteService,
} = require("../controllers/servicesController");

const router = express.Router();

router.get('/', getAllServicesWithOwners);
router.post('/', createServiceWithOwnerAndVehicle);
router.get('/:id', getServiceByIdWithOwnersAndVehicle);
router.put('/:id', updateServiceWithOwnerAndVehicle);
router.delete('/:id', deleteService);

module.exports = router;
