const express = require('express');
const router = express.Router();
const controlador = require('./controlador');

router.post('/login', controlador.login);
router.post('/registro', controlador.registro);

module.exports = router;

router.get('/crear-prueba', controlador.crearUsuarioPrueba);
