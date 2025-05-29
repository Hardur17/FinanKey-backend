const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../DB/conn');

// LOGIN
exports.login = (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ msg: "Datos incompletos" });
  }

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err) return res.status(500).json({ msg: "Error en BD" });

    if (results.length === 0) return res.status(401).json({ msg: "Usuario no encontrado" });

    const usuario = results[0];
    const match = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!match) return res.status(401).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, usuario: { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre } });
  });
};

// REGISTRO
exports.registro = async (req, res) => {
  const { correo, contrasena, nombre } = req.body;

  if (!correo || !contrasena || !nombre) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err) return res.status(500).json({ msg: "Error en la base de datos" });
    if (results.length > 0) return res.status(409).json({ msg: "El correo ya está registrado" });

    const hash = await bcrypt.hash(contrasena, 10);

    db.query('INSERT INTO usuarios (correo, contrasena, nombre) VALUES (?, ?, ?)', [correo, hash, nombre], (err, result) => {
      if (err) return res.status(500).json({ msg: "Error al registrar usuario" });

      res.status(201).json({ msg: "Usuario registrado correctamente" });
    });
  });
};


// RUTA TEMPORAL PARA CREAR USUARIO DE PRUEBA
exports.crearUsuarioPrueba = async (req, res) => {
  const correo = 'prueba@correo.com';
  const nombre = 'Usuario de Prueba';
  const contrasena = '123456';

  db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (err, results) => {
    if (err) return res.status(500).json({ msg: "Error en la base de datos" });
    if (results.length > 0) return res.status(409).json({ msg: "Ya existe el usuario de prueba" });

    const hash = await bcrypt.hash(contrasena, 10);

    db.query('INSERT INTO usuarios (correo, contrasena, nombre) VALUES (?, ?, ?)', [correo, hash, nombre], (err, result) => {
      if (err) return res.status(500).json({ msg: "Error al crear usuario" });

      res.status(201).json({ msg: "Usuario de prueba creado correctamente" });
    });
  });
};
