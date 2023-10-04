const logging = require('../utils/logging');
const { sendResponse } = require('../utils/response');
const Service = require('../models/Service');
const ServiceOwner = require('../models/ServiceOwner');
const mongoose = require('mongoose');
const NAMESPACE = 'Service Controller';

const createServiceWithOwnerAndVehicle = async (req, res) => {
  try {
    // Obtener los datos del servicio del cuerpo de la solicitud
    const serviceData = req.body.serviceData; 
    const ownerData = req.body.ownerData; 

    // Crear un nuevo propietario con los datos proporcionados
    const owner = new ServiceOwner({
      _id: new mongoose.Types.ObjectId(),
      associatedVehicle: {
        patent: ownerData.associatedVehicle.patent,
        brand: ownerData.associatedVehicle.brand,
        model: ownerData.associatedVehicle.model,
        year: ownerData.associatedVehicle.year,
      },
      owner: {
        ownerName: ownerData.owner.ownerName,
        ownerPhone: ownerData.owner.ownerPhone,
        ownerEmail: ownerData.owner.ownerEmail,
        ownerAddress: ownerData.owner.ownerAddress,
        ownerCity: ownerData.owner.ownerCity,
      },
    });
    await owner.save();

    // Crear un nuevo servicio con los datos proporcionados
    const service = new Service({
      patent: serviceData.patent,
      km: serviceData.km,
      seller: serviceData.seller,
      oilFilter: {
        changed: serviceData.oilFilter.changed,
      },
      airFilter: {
        changed: serviceData.airFilter.changed,
        reviewed: serviceData.airFilter.reviewed,
      },
      fuelFilter: {
        changed: serviceData.fuelFilter.changed,
      },
      motorOil: {
        changed: serviceData.motorOil.changed,
        density: serviceData.motorOil.density,
        OilType: serviceData.motorOil.OilType,
      },
      gearboxOil: {
        changed: serviceData.gearboxOil.changed,
        reviewed: serviceData.gearboxOil.reviewed,
        OilType: serviceData.gearboxOil.OilType,
      },
      steeringOil: {
        changed: serviceData.steeringOil.changed,
        reviewed: serviceData.steeringOil.reviewed,
        OilType: serviceData.steeringOil.OilType,
      },
      others: serviceData.others,
    });

    // Asignar la patente del vehículo al servicio
    service.associatedVehicle = owner.associatedVehicle;

    // Guardar el servicio en la base de datos
    await service.save();

    // Obtener el servicio con propietario y vehículo asociado utilizando populate
    // const serviceWithOwnerAndVehicle = await Service.findById(service._id)
    //   .populate({
    //     path: 'patent',
    //     model: 'ServiceOwner',
    //     populate: {
    //       path: 'associatedVehicle',
    //       model: 'ServiceOwner',
    //     },
    //   });

    return sendResponse(res, 201, 'Service created successfully', { service: service, owner: owner });
  } catch (error) {
    console.error('Error in createServiceWithOwnerAndVehicle:', error);
    return sendResponse(res, 500, '', error);
  }
};



const getAllServicesWithOwners = async (req, res) => {
  logging.info(NAMESPACE, 'getAllServicesWithOwners Method');
  try{
    const services = await Service.find()
    const owners = await ServiceOwner.find();
    const patentToOwnerMap = {};
    owners.forEach(owner => {
      patentToOwnerMap[owner.associatedVehicle.patent] = owner.owner;
    });
    const patentToVehicleMap = {};
    owners.forEach(owner => {
      patentToVehicleMap[owner.associatedVehicle.patent] = owner.associatedVehicle;
    });
    const servicesWithOwners = services.map(service => {
      const ownerInfo = patentToOwnerMap[service.patent] || {};
      const vehicleInfo = patentToVehicleMap[service.patent] || {};
      return {
        ...service.toObject(),
        owner: ownerInfo,
        vehicle: vehicleInfo,
      };
    });

    if(!servicesWithOwners) return sendResponse(res, 404, 'Services not found');

    return sendResponse(res, 200, 'Services retrieved successfully', {servicesWithOwners});
  }catch(error){
    console.error('Error in getAllServicesWithOwners:', error);
    return sendResponse(res, 500, '', error);
  }
}

const getServiceByIdWithOwnersAndVehicle = async (req, res) => {
  logging.info(NAMESPACE, 'getServiceByIdWithOwnersAndVehicle Method')
  try{
    const serviceId = req.params.id;
    if(!serviceId) return sendResponse(res, 400, 'Service ID is required');

    const service = await Service.findById(serviceId);
    const owner = await ServiceOwner.findOne({'associatedVehicle.patent': service.patent});
    const vehicle = owner.associatedVehicle;

    if(!service) return sendResponse(res, 404, 'Service not found');

    return sendResponse(res, 200, 'Service retrieved successfully', {service, owner, vehicle});
  }catch(error){
    console.error('Error in getServiceByIdWithOwnersAndVehicle:', error);
    return sendResponse(res, 500, '', error);
  }
}

const updateServiceWithOwnerAndVehicle = async (req, res) => {
  logging.info(NAMESPACE, 'UpdateService Method');
  try{
    const serviceId = req.params.id;
    const serviceData = req.body.serviceData;
    const ownerData = req.body.ownerData;
    const service = await Service.findByIdAndUpdate(serviceId, serviceData);
    const owner = await ServiceOwner.findOneAndUpdate({'associatedVehicle.patent': service.patent}, ownerData);
    const vehicle = owner.associatedVehicle;
    if(!service) return sendResponse(res, 404, 'Service not found');
    if(!owner) return sendResponse(res, 404, 'Owner not found');
    return sendResponse(res, 200, 'Service updated successfully', {service, owner, vehicle});
  }catch(error){
    logging.error(NAMESPACE, 'UpdateService Method', error);
    return sendResponse(res, 500, '', error);
  }
}
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
