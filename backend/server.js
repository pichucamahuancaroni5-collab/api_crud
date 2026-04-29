const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ mensaje: "API CRUD funcionando con la base app_crud" });
});

async function runQuery(res, sql, params = []) {
  try {
    const [result] = await pool.query(sql, params);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/* STATUS */
app.get("/api/status", async (req, res) => {
  try {
    const [categorias] = await pool.query("SELECT COUNT(*) AS total FROM categorias");
    const [productos] = await pool.query("SELECT COUNT(*) AS total FROM productos");
    const [clientes] = await pool.query("SELECT COUNT(*) AS total FROM clientes");
    const [proveedores] = await pool.query("SELECT COUNT(*) AS total FROM proveedores");

    res.json({
      categorias: categorias[0].total,
      productos: productos[0].total,
      clientes: clientes[0].total,
      proveedores: proveedores[0].total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* CATEGORIAS */
app.get("/api/categorias", (req, res) => {
  runQuery(res, "SELECT * FROM categorias ORDER BY id DESC");
});

app.post("/api/categorias", (req, res) => {
  const { nombre, descripcion } = req.body;
  runQuery(res, "INSERT INTO categorias(nombre, descripcion) VALUES(?, ?)", [
    nombre,
    descripcion
  ]);
});

app.put("/api/categorias/:id", (req, res) => {
  const { nombre, descripcion } = req.body;
  runQuery(res, "UPDATE categorias SET nombre=?, descripcion=? WHERE id=?", [
    nombre,
    descripcion,
    req.params.id
  ]);
});

app.delete("/api/categorias/:id", (req, res) => {
  runQuery(res, "DELETE FROM categorias WHERE id=?", [req.params.id]);
});

/* PRODUCTOS */
app.get("/api/productos", (req, res) => {
  runQuery(res, "SELECT * FROM productos ORDER BY id DESC");
});

app.post("/api/productos", (req, res) => {
  const { nombre, precio, stock, categoria_id } = req.body;
  runQuery(
    res,
    "INSERT INTO productos(nombre, precio, stock, categoria_id) VALUES(?, ?, ?, ?)",
    [nombre, precio, stock, categoria_id || null]
  );
});

app.put("/api/productos/:id", (req, res) => {
  const { nombre, precio, stock, categoria_id } = req.body;
  runQuery(
    res,
    "UPDATE productos SET nombre=?, precio=?, stock=?, categoria_id=? WHERE id=?",
    [nombre, precio, stock, categoria_id || null, req.params.id]
  );
});

app.delete("/api/productos/:id", (req, res) => {
  runQuery(res, "DELETE FROM productos WHERE id=?", [req.params.id]);
});

/* CLIENTES */
app.get("/api/clientes", (req, res) => {
  runQuery(res, "SELECT * FROM clientes ORDER BY id DESC");
});

app.post("/api/clientes", (req, res) => {
  const { nombre, correo, telefono } = req.body;
  runQuery(res, "INSERT INTO clientes(nombre, correo, telefono) VALUES(?, ?, ?)", [
    nombre,
    correo,
    telefono
  ]);
});

app.put("/api/clientes/:id", (req, res) => {
  const { nombre, correo, telefono } = req.body;
  runQuery(res, "UPDATE clientes SET nombre=?, correo=?, telefono=? WHERE id=?", [
    nombre,
    correo,
    telefono,
    req.params.id
  ]);
});

app.delete("/api/clientes/:id", (req, res) => {
  runQuery(res, "DELETE FROM clientes WHERE id=?", [req.params.id]);
});

/* PROVEEDORES */
app.get("/api/proveedores", (req, res) => {
  runQuery(res, "SELECT * FROM proveedores ORDER BY id DESC");
});

app.post("/api/proveedores", (req, res) => {
  const { nombre, ruc, telefono, direccion } = req.body;
  runQuery(
    res,
    "INSERT INTO proveedores(nombre, ruc, telefono, direccion) VALUES(?, ?, ?, ?)",
    [nombre, ruc, telefono, direccion]
  );
});

app.put("/api/proveedores/:id", (req, res) => {
  const { nombre, ruc, telefono, direccion } = req.body;
  runQuery(
    res,
    "UPDATE proveedores SET nombre=?, ruc=?, telefono=?, direccion=? WHERE id=?",
    [nombre, ruc, telefono, direccion, req.params.id]
  );
});

app.delete("/api/proveedores/:id", (req, res) => {
  runQuery(res, "DELETE FROM proveedores WHERE id=?", [req.params.id]);
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});