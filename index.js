const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const AuthRoutes = require('./src/routes/authRoutes');
const UserRoutes = require('./src/routes/userRoutes');
const OrderRoutes = require('./src/routes/orderRoutes');
const SupplierRoutes = require('./src/routes/supplierRoutes');
const CategoryRoutes = require('./src/routes/categoryRoutes');
const ProductRoutes = require('./src/routes/productRoutes');
const ServiceRoute = require('./src/routes/serviceRoutes.js');
const ClientsRoutes = require('./src/routes/clientsRoutes.js');
// Initialize environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => {
        console.info(`✔ Database connected successfully to ByM`);
    })
    .catch((err) => console.error(`✖ Couldn't connect to database:`, err));

// Request logging
app.use((req, res, next) => {
    console.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/auth', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/suppliers', SupplierRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/services', ServiceRoute)
app.use('/api/clients', ClientsRoutes);
// app.use('/api/images', ImageRoutes);
// ROUTE DE CLIENTES USA EL MISMO CONTROLADOR QUE EL DE USUARIOS?
// app.use('/api/clients', ClientRoutes);]


// Error Handling
app.use((err, req, res, next) => {
    console.error(`Error encountered: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

// Start Server
const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.info(`✔ Server operational → PORT ${port}`);
});
