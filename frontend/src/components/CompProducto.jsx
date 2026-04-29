import { useEffect, useState } from 'react';
import API from '../api';

export default function CompProducto() {
  const [datos, setDatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria_id: ''
  });
  const [editando, setEditando] = useState(null);

  const listar = async () => {
    const res = await API.get('/productos');
    setDatos(res.data);
  };

  const cargarCategorias = async () => {
    const res = await API.get('/categorias');
    setCategorias(res.data);
  };

  useEffect(() => {
    listar();
    cargarCategorias();
  }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (editando) await API.put(`/productos/${editando}`, form);
    else await API.post('/productos', form);

    setForm({ nombre: '', precio: '', stock: '', categoria_id: '' });
    setEditando(null);
    listar();
  };

  const editar = (item) => {
    setForm({
      nombre: item.nombre || '',
      precio: item.precio || '',
      stock: item.stock || '',
      categoria_id: item.categoria_id || ''
    });
    setEditando(item.id);
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar producto?')) {
      await API.delete(`/productos/${id}`);
      listar();
    }
  };

  const nombreCategoria = (categoria_id) => {
    const categoria = categorias.find(c => Number(c.id) === Number(categoria_id));
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  return (
    <section className="card">
      <h2>CRUD Producto</h2>

      <form onSubmit={guardar} className="formulario">
        <input
          placeholder="Nombre del producto"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.precio}
          onChange={e => setForm({ ...form, precio: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          required
        />

        <select
          value={form.categoria_id}
          onChange={e => setForm({ ...form, categoria_id: e.target.value })}
          required
        >
          <option value="">Seleccione categoría</option>
          {categorias.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <button>{editando ? 'Actualizar' : 'Guardar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>S/ {item.precio}</td>
              <td>{item.stock}</td>
              <td>{nombreCategoria(item.categoria_id)}</td>
              <td>
                <button onClick={() => editar(item)}>Editar</button>
                <button className="danger" onClick={() => eliminar(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}