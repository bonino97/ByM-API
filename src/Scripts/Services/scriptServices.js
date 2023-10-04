const mongoose = require('mongoose');
const xlsx = require('xlsx');
const dateFns = require('date-fns');
const Service = require('../../models/Service'); // Asegúrate de que la ruta sea correcta

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb+srv://bautistabadino9:bautibad@cluster0.dxntcy4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', async () => {
console.log('Conexión a MongoDB establecida con éxito');
const db = mongoose.connection;

// Carga el archivo .xls
const workbook = xlsx.readFile('./movimientos.xls');
const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Suponemos que el archivo tiene una sola hoja

// Obtiene los datos de la hoja
const sheetData = xlsx.utils.sheet_to_json(worksheet);

function getJsDateFromExcel(excelDate) {
  return new Date((excelDate - 25569) * 86400 * 1000);
}

// Función para convertir el formato de datos del archivo .xls al formato de tu modelo
function convertToServiceData(xlsRow) {

    const serviceData = {
        patent: String(xlsRow["CODCLI,C,7"]),
        km: String(xlsRow["KM,C,10"]),
        oilFilter: {
            changed: xlsRow['FACT,C,1'] === 'C' ? true : false,
            // type: xlsRow['FILTROAC,C,30'] || null,
        },
        airFilter: {
            changed: xlsRow['FAIT,C,1'] === 'C' ? true : false,
            reviewed: xlsRow['FAIT,C,1'] === 'R' ? true : false,
            // type: xlsRow['FILTROAI,C,30'] || null,
        },
        fuelFilter: {
            changed: xlsRow['FCT,C,1'] === 'C' ? true : false,
            // type: xlsRow['FILTROCO,C,30'] || null,
        },
        motorOil: {
            changed: xlsRow['AMT,C,1'] === 'C' ? true : false,
            // density: xlsRow['TIPOAM,C,30'] || null,
            OilType: xlsRow['ACEITEM,C,30'] || null,
        },
        gearboxOil: {
            changed: xlsRow['ACT,C,1'] === 'C' ? true : false,
            reviewed: xlsRow['ACT,C,1'] === 'R' ? true : false,
            OilType: xlsRow['ACEITEC,C,30'] || null,
        },
        steeringOil: {
            changed: xlsRow['ADT,C,1'] === 'C' ? true : false,
            reviewed: xlsRow['ADT,C,1'] === 'R' ? true : false,
            OilType: xlsRow['ACEITED,C,30'] || null,
        },
        Date:  getJsDateFromExcel(xlsRow['FECMOV,D']),
    };

    // Convierte todos los valores de serviceData a cadenas de texto o nulos
    for (const key in serviceData) {
        if (typeof serviceData[key] === 'object' && serviceData[key] !== null) {
            serviceData[key] = JSON.parse(JSON.stringify(serviceData[key]));

        }
    }

    return serviceData;
}
// Itera sobre los datos del archivo .xls y crea documentos de Service en la base de datos
const importData = async () => {
    for (const xlsRow of sheetData) {
      const serviceData = convertToServiceData(xlsRow);
      const service = new Service(serviceData);
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
