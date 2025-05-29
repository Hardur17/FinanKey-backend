const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./conexion');

const register = (req, res) => {
    const { nombre, correo, contrasena } = req.body;
    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: 'Faltan campos' });
    }

    bcrypt.hash(contrasena, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });

        db.query(
            'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
            [nombre, correo, hash],
            (error) => {
                if (error) {
                    console.log(" Error al registrar:", error);  
                    return res.status(500).json({ error: 'Error al registrar' });
                }

                res.status(201).json({ mensaje: 'Usuario registrado' });
            }
        );
    });
};

const login = (req, res) => {
    const { correo, contrasena } = req.body;

    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (error, results) => {
        if (error || results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        bcrypt.compare(contrasena, usuario.contrasena, (err, result) => {
            if (err || !result) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            const token = jwt.sign(
                { id: usuario.id, correo: usuario.correo },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ mensaje: 'Login exitoso', token });
        });
    });
};

const obtenerUsuarios = (req, res) => {
    db.query('SELECT id, nombre, correo, fecha_creacion FROM usuarios', (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }

        res.json(results);
    });
};

module.exports = { register, login, obtenerUsuarios };
