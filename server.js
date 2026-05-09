const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Importamos la conexión a MySQL
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Sirve el HTML desde la carpeta public[cite: 1, 2]

// 1. Obtener Menú desde MySQL[cite: 2]
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM menu');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el menú" });
    }
});

// 1.1 Obtener Clientes desde MySQL[cite: 2]
app.get('/api/clientes', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los clientes" });
    }
});

// 1.2 Obtener pedidos desde MySQL[cite: 2]
app.get('/api/pedidos', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los pedidos" });
    }
});

// 2. Crear Pedido y Cliente (Transacción lógica)[cite: 2]
app.post('/api/pedidos', async (req, res) => {
    const { cliente, total } = req.body;
    
    if (!cliente) return res.status(400).json({ error: "Datos incompletos" });

    // 🚨 Nueva validación para evitar precios negativos o cero
  if (typeof total !== "number" || total <= 0) {
    return res.status(400).json({ error: "El total debe ser mayor a 0" });
  }
    
    try {
        // Asegurar que el cliente existe o crearlo
        await db.query('INSERT IGNORE INTO clientes (nombre) VALUES (?)', [cliente]);
        const [user] = await db.query('SELECT id FROM clientes WHERE nombre = ?', [cliente]);
        const cliente_id = user[0].id;

        // Insertar el pedido[cite: 2]
        const [pedidoResult] = await db.query(
            'INSERT INTO pedidos (cliente_id, total, estado) VALUES (?, ?, ?)',
            [cliente_id, total || 0, 'Preparando']
        );

        res.status(201).json({
            mensaje: "Pedido guardado en MySQL",
            pedido: { id: pedidoResult.insertId, cliente, total }
        });
    } catch (error) {
        res.status(500).json({ error: "Error al procesar el pedido" });
    }
});

// 3. Consultar Pedido por ID con JOIN[cite: 2]
app.get('/api/pedidos/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT p.id, c.nombre as cliente, p.total, p.estado, p.fecha 
             FROM pedidos p 
             JOIN clientes c ON p.cliente_id = c.id 
             WHERE p.id = ?`, [req.params.id]
        );
        
        if (rows.length === 0) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error en la consulta" });
    }
});

// 4. Actualizar pedido completo (PUT) - Adaptado de Fuente 1 a SQL
app.put('/api/pedidos/:id', async (req, res) => {
    const { total, estado } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE pedidos SET total = ?, estado = ? WHERE id = ?',
            [total, estado, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json({ mensaje: "Pedido actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el pedido" });
    }
});

// 5. Actualizar solo el estado (PATCH) - Adaptado de Fuente 1 a SQL
app.patch('/api/pedidos/:id/estado', async (req, res) => {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ error: "Estado no proporcionado" });
    
    try {
        const [result] = await db.query(
            'UPDATE pedidos SET estado = ? WHERE id = ?',
            [estado, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json({ mensaje: "Estado actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar estado" });
    }
});

// 6. Eliminar un pedido (DELETE) - Adaptado de Fuente 1 a SQL
app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM pedidos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Pedido no encontrado" });
        res.json({ mensaje: "Pedido eliminado de la base de datos" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el pedido" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de restaurante con MySQL corriendo en http://localhost:${PORT}`);
});