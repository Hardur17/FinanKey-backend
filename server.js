const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const rutas = require('./src/auth/rutas');

app.use(cors());
app.use(express.json());
app.use('/api', rutas);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Base de datos seleccionada: ${process.env.DB_NAME}`);
});
