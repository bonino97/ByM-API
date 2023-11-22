const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Check = require('../../models/Check'); // Asegúrate de que la ruta sea correcta
const e = require('cors');

// Conecta a la base de datos MongoDB

mongoose.connect('mongodb+srv://bautistabadino9:bautibad@cluster0.dxntcy4.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Maneja eventos de conexión
mongoose.connection.on('connected', async () => {
    console.log('Conexión a MongoDB establecida con éxito');
    const db = mongoose.connection;
    const workbook = xlsx.readFile('./cheques-1.xls'); // Ruta archivo
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convierte los datos del archivo .xls a un arreglo de objetos
    const data = xlsx.utils.sheet_to_json(worksheet);

    function getJsDateFromExcel(excelDate) {
        return new Date((excelDate - 25569) * 86400 * 1000);
    }
    // Itera sobre los datos y guárdalos en la base de datos
    function convertCheckData(xlsRow) {
        const checkData = {
            chequeNumber: xlsRow['NUMCHE,C,15'],
            bank: xlsRow['BANCO,C,30'],
            amount: xlsRow['IMPORTE,N,12,2'],
            drawer: xlsRow['LIBRADOR,C,30'],
            deliveredBy: xlsRow['ENTPOR,C,30'],
            expiredDate: xlsRow['FECCOB,D'],
            cuit: xlsRow['CUIT,C,11'],
            deliveredTo: xlsRow['ENTREGADO,C,30'],
            status: xlsRow['ESTADO,C,1'] === 'O' && 'COLECTED' ||
                xlsRow['ESTADO,C,1'] === 'D' && 'DEPOSITED' ||
                xlsRow['ESTADO,C,1'] === 'E' && 'DELIVERED' ||
                xlsRow['ESTADO,C,1'] === 'C' && 'PENDING',
            bankPlace: xlsRow['PLAZA,C,30'],
            expiredDate: getJsDateFromExcel(xlsRow['FECCOB,D']),
        }
        for (const key in checkData) {
            if (typeof checkData[key] === 'object' && checkData[key] !== null) {
                checkData[key] = JSON.parse(JSON.stringify(checkData[key]));
            }
        }
        return checkData;
    }

    const importData = async () => {
        for (const xlsRow of data) {
            const checkInfo = convertCheckData(xlsRow);
            const check = new Check(checkInfo);
            try{
                await check.save();
                console.log('Cheque guardado con éxito:' + check);
            }
            catch(err){
                console.error('Error al guardar el cheque:', err);
            }
        }

    }
    importData()
    .then(() => {
        console.log('Importación finalizada');
        db.close();
    })
    .catch((err) => {
        console.error('Error de importación:', err);
        db.close();
    });
});

