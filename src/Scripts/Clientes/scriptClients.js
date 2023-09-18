const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Client = require('../../models/Client'); // Asegúrate de que la ruta sea correcta

// Conecta a la base de datos MongoDB

mongoose.connect('mongodb+srv://bautistabadino9:bautibad@cluster0.dxntcy4.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Maneja eventos de conexión
mongoose.connection.on('connected', async () => {
  console.log('Conexión a MongoDB establecida con éxito');

  // Lee el archivo .xls
  const workbook = XLSX.readFile('./clientes.xls'); // Reemplaza con la ruta de tu archivo

  // Obtiene la hoja de trabajo (worksheet)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convierte los datos del archivo .xls a un arreglo de objetos
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Define un mapeo de columnas a campos de tu modelo
  const columnMapping = {
    'NOMCLI,C,30': 'name',
    'DIRCLI,C,30': 'address',
    'LOCCLI,C,30': 'location',
    'CUICLI,C,11': 'cuit'
  };

  // Itera sobre los datos y guárdalos en la base de datos
  data.forEach(async (row) => {
    // Crea un objeto de cliente utilizando el mapeo de columnas
    const clientData = {
      name: row['NOMCLI,C,30'],
      address: row['DIRCLI,C,30'],
      location: row['LOCCLI,C,30'],
      cuit: row['CUICLI,C,11']
    };
    console.log(clientData);

    
    try {
      const client = new Client(clientData);
      const clientFiltered = await Client.findOne({ name: client.name });

      await client.save();
      console.log(`Cliente ${client.name} guardado en la base de datos.`);
    } catch (error) {
      console.error(`Error al guardar el cliente ${clientData.name}: ${error}`);
    }
  });

  // Cierra la conexión a la base de datos cuando termines
  mongoose.connection.close();
});

// Maneja eventos de error de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error de conexión a MongoDB:', err);
});

// Maneja eventos de desconexión
mongoose.connection.on('disconnected', () => {
  console.log('Desconexión de MongoDB');
});
