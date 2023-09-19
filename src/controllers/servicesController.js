const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Service = require('../models/Service');
const ServiceOwner = require('../models/ServiceOwner');

const NAMESPACE = 'Service Controller';

const createServiceWithOwnerAndVehicle = async (req, res) => {
  try {
    // Obtener los datos del servicio del cuerpo de la solicitud
    const serviceData = req.body.serviceData; // Asegúrate de que el cuerpo de la solicitud contenga la información del servicio

    // Obtener los datos del propietario del cuerpo de la solicitud
    const ownerData = req.body.ownerData; // Asegúrate de que el cuerpo de la solicitud contenga la información del propietario

    // Crear un nuevo propietario con los datos proporcionados
    const owner = new ServiceOwner(ownerData);

    // Guardar el propietario en la base de datos
    await owner.save();

    // Crear un nuevo servicio con los datos proporcionados
    const service = new Service({
      patent: serviceData.patent,
      km: serviceData.km,
      seller: serviceData.seller, // Puedes ajustar esto según tus necesidades
      oilFilter: serviceData.oilFilter,
      // Agregar otros campos del servicio según sea necesario
    });

    // Asignar la patente del vehículo al servicio
    service.associatedVehicle = owner.associatedVehicle;

    // Guardar el servicio en la base de datos
    await service.save();

    // Obtener el servicio con propietario y vehículo asociado utilizando populate
    const serviceWithOwnerAndVehicle = await Service.findById(service._id)
      .populate({
        path: 'patent',
        model: 'ServiceOwner',
        populate: {
          path: 'associatedVehicle',
          model: 'ServiceOwner',
        },
      });

    return sendResponse(res, 201, 'Service created successfully', { service: serviceWithOwnerAndVehicle });
  } catch (error) {
    console.error('Error in createServiceWithOwnerAndVehicle:', error);
    return sendResponse(res, 500, '', error);
  }
};


const getAllServicesWithOwners = async (req, res) => {
    try {
      // Obtener todos los servicios con sus propietarios y vehículos asociados
      const services = await Service.find()
        .populate({
          path: 'patent',
          model: 'ServiceOwner',
          populate: {
            path: 'associatedVehicle',
            model: 'ServiceOwner',
          },
        });
  
      if (services.length === 0) {
        return res.status(404).json({ message: 'No services found' });
      }
  
      return res.status(200).json({ message: 'Services retrieved successfully', services });
    } catch (error) {
      console.error('Error in getAllServicesWithOwners:', error);
      return res.status(500).json({ message: 'Internal server error', error });
    }
  };
  
const getServiceByIdWithOwnersAndVehicle = async (req, res) => {
    try {
      const serviceId = req.params.id;
      if (!serviceId) return sendResponse(res, 400, 'Service ID is required');
  
      // Obtener el servicio por ID con propietario y vehículo asociado utilizando populate
      const service = await Service.findById(serviceId)
        .populate({
          path: 'patent',
          model: 'ServiceOwner',
          populate: {
            path: 'associatedVehicle',
            model: 'ServiceOwner',
          },
        });
  
      if (!service) return sendResponse(res, 404, 'Service not found');
  
      return sendResponse(res, 200, 'Service retrieved successfully', { service });
    } catch (error) {
      console.error('Error in getServiceByIdWithOwnersAndVehicles:', error);
      return sendResponse(res, 500, '', error);
    }
  };
  const updateServiceWithOwnerAndVehicle = async (req, res) => {
    try {
      const serviceId = req.params.id;
      if (!serviceId) return sendResponse(res, 400, 'Service ID is required');
  
      // Obtener los nuevos datos del servicio del cuerpo de la solicitud
      const updatedServiceData = req.body.updatedServiceData; // Asegúrate de que el cuerpo de la solicitud contenga los datos de actualización
  
      // Obtener los nuevos datos del propietario del cuerpo de la solicitud
      const updatedOwnerData = req.body.updatedOwnerData; // Asegúrate de que el cuerpo de la solicitud contenga los datos de actualización del propietario
  
      // Actualizar el propietario por la patente del vehículo asociado
      await ServiceOwner.findOneAndUpdate(
        { 'associatedVehicle.patent': updatedServiceData.patent }, // Filtro por patente del vehículo asociado
        updatedOwnerData, // Datos de actualización del propietario
        { new: true } // Esto devuelve el propietario actualizado
      );
  
      // Actualizar el servicio por su ID con los nuevos datos
      const service = await Service.findByIdAndUpdate(
        serviceId,
        updatedServiceData,
        { new: true } // Esto devuelve el servicio actualizado
      );
  
      if (!service) return sendResponse(res, 404, 'Service not found');
  
      // Obtener el servicio con propietario y vehículo asociado utilizando populate
      const serviceWithOwnerAndVehicle = await Service.findById(service._id)
        .populate({
          path: 'patent',
          model: 'ServiceOwner',
          populate: {
            path: 'associatedVehicle',
            model: 'ServiceOwner',
          },
        });
  
      return sendResponse(res, 200, 'Service and associated data updated successfully', { service: serviceWithOwnerAndVehicle });
    } catch (error) {
      console.error('Error in updateServiceWithOwnerAndVehicle:', error);
      return sendResponse(res, 500, '', error);
    }
  };

const deleteService = async (req, res) => {
    logging.info(NAMESPACE, 'DeleteService Method');
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return sendResponse(res, 404, 'Service not found');
        }
        return sendResponse(res, 200, 'Service deleted successfully', { deletedService });
    } catch (error) {
        logging.error(NAMESPACE, 'DeleteService Method', error);
        return sendResponse(res, 500, '', error);
    }
};


module.exports = {
    getAllServicesWithOwners,
    getServiceByIdWithOwnersAndVehicle,
    createServiceWithOwnerAndVehicle,
    updateServiceWithOwnerAndVehicle,
    deleteService,
};
