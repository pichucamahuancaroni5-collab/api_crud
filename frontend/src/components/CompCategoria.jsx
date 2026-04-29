import { useEffect, useState } from 'react';
import API from '../api';

export default function CompCategoria() {
  const [datos, setDatos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [editando, setEditando] = useState(null);

  const listar = async () => {
    const res = await API.get('/categorias');
    setDatos(res.data);
  };

  useEffect(() => { listar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (editando) await API.put(`/categorias/${editando}`, form);
    else await API.post('/categorias', form);

    setForm({ nombre: '', descripcion: '' });
    setEditando(null);
    listar();
  };

  const editar = (item) => {
    setForm({
      nombre: item.nombre || '',
      descripcion: item.descripcion || ''
    });
    setEditando(item.id);
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar categoría?')) {
      await API.delete(`/categorias/${id}`);
      listar();
    }
  };

  return (
    <section className="card">
      <h2>CRUD Categoría</h2>

      <form onSubmit={guardar} className="formulario">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          required
        />

        <button>{editando ? 'Actualizar' : 'Guardar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.descripcion}</td>
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