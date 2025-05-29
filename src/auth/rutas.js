const express = require('express');
const router = express.Router();
const { register, login, obtenerUsuarios } = require('./controlador');
const verificarToken = require('./verificarToken');
const db = require('./conexion');

// 🔐 Registro y Login
router.post('/register', register);
router.post('/login', login);
router.get('/usuarios', verificarToken, obtenerUsuarios);

// 💰 Transacciones
router.post('/transacciones', (req, res) => {
  const { usuario_id, tipo, cantidad, fecha } = req.body;
  if (!usuario_id || !tipo || !cantidad || !fecha) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  db.query(
    'INSERT INTO transacciones (usuario_id, tipo, cantidad, fecha) VALUES (?, ?, ?, ?)',
    [usuario_id, tipo, cantidad, fecha],
    (error) => {
      if (error) {
        console.error("❌ Error al guardar transacción:", error);
        return res.status(500).json({ error: 'Error al guardar transacción' });
      }
      res.status(201).json({ mensaje: 'Transacción guardada' });
    }
  );
});

router.get('/transacciones/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  db.query(
    'SELECT * FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC',
    [usuario_id],
    (error, results) => {
      if (error) return res.status(500).json({ error: 'Error al obtener transacciones' });
      res.json(results);
    }
  );
});

// 📊 Presupuestos
router.post('/presupuestos', (req, res) => {
  const { usuario_id, categoria, limite } = req.body;
  if (!usuario_id || !categoria || !limite) {
    return res.status(400).json({ error: 'Faltan campos' });
  }

  db.query(
    'INSERT INTO presupuestos (usuario_id, categoria, limite) VALUES (?, ?, ?)',
    [usuario_id, categoria, limite],
    (error) => {
      if (error) {
        console.error("❌ Error al guardar presupuesto:", error);
        return res.status(500).json({ error: 'Error al guardar presupuesto' });
      }
      res.status(201).json({ mensaje: 'Presupuesto guardado' });
    }
  );
});

router.get('/presupuestos/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  db.query(
    'SELECT * FROM presupuestos WHERE usuario_id = ? ORDER BY fecha_creacion DESC',
    [usuario_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener presupuestos' });
      }
      res.json(results);
    }
  );
});

// 📈 Resumen mensual para visualización
router.get('/resumen-mensual/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m') AS mes,
      tipo,
      SUM(cantidad) AS total
    FROM transacciones
    WHERE usuario_id = ?
    GROUP BY mes, tipo
    ORDER BY mes ASC
  `;

  db.query(sql, [usuario_id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener resumen mensual' });
    }

    res.json(results);
  });
});

module.exports = router;
