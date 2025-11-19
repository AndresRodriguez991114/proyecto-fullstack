const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Endpoint login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const result = await pool.query(
      'SELECT id, nombre, email, rol, password FROM Usuarios WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Comparar password usando bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Retornar datos del usuario (sin password)
    const { id, nombre, rol } = user;
    res.json({ userId: id, nombre, rol });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
