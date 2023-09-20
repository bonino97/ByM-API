const mongoose = require('mongoose');
const xlsx = require('xlsx');
const ServiceOwner = require('../../../models/ServiceOwner'); 

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb+srv://bautistabadino9:bautibad@cluster0.dxntcy4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', async () => {
    console.log('Conexión a MongoDB establecida con éxito');
const db = mongoose.connection;

// Carga el archivo .xls
const workbook = xlsx.readFile('./clientes-1.xls');
const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Suponemos que el archivo tiene una sola hoja

// Obtiene los datos de la hoja
const sheetData = xlsx.utils.sheet_to_json(worksheet);

// Función para convertir el formato de datos del archivo .xls al formato de tu modelo
    function convertToServiceData(xlsRow) {

        const serviceData = {
            associatedVehicle: {
                patent: xlsRow['CODCLI,C,7'],
                brand: xlsRow['MARCA,C,30'],
                model: xlsRow['MODELO,C,30'],
                year: xlsRow["ANIO,C,4"]
            },
            owner:{
                ownerName: xlsRow['NOMCLI,C,30'],
                ownerPhone: xlsRow['CELCLI,C,15'],
                ownerEmail: xlsRow['MAICLI,C,50'],
                ownerAddress: xlsRow['DIRCLI,C,30'],
                ownerCity: xlsRow['LOCCLI,C,30'],
            },
        };

    // Convierte todos los valores de serviceData a cadenas de texto o nulos
    for (const key in serviceData) {
        if (typeof serviceData[key] === 'object' && serviceData[key] !== null) {
            serviceData[key] = JSON.parse(JSON.stringify(serviceData[key]));
        }
    }

    return serviceData;
}



// ...

// Itera sobre los datos del archivo .xls y crea documentos de Service en la base de datos
const importData = async () => {
    for (const xlsRow of sheetData) {
      const serviceData = convertToServiceData(xlsRow);
      const service = new ServiceOwner(serviceData);
      try {
        await service.save();
        console.log(serviceData);
      } catch (err) {
        console.error('Error en el documento:', err);
        // Puedes agregar lógica aquí para manejar el error de acuerdo a tus necesidades
      }
    }
    // Cierra la conexión a la base de datos después de completar todas las inserciones
    db.close();
  }
  
  importData()
    .then(() => {
      console.log('Importación completada');
    })
    .catch((error) => {
      console.error('Error durante la importación:', error);
    });

});
// Cierra la conexión a la base de datos cuando se haya completado la importación
