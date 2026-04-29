import { useEffect, useState } from 'react';
import API from '../api';

export default function CompCliente() {
  const [datos, setDatos] = useState([]);
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '' });
  const [editando, setEditando] = useState(null);

  const listar = async () => {
    const res = await API.get('/clientes');
    setDatos(res.data);
  };

  useEffect(() => { listar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (editando) await API.put(`/clientes/${editando}`, form);
    else await API.post('/clientes', form);

    setForm({ nombre: '', correo: '', telefono: '' });
    setEditando(null);
    listar();
  };

  const editar = (item) => {
    setForm({
      nombre: item.nombre || '',
      correo: item.correo || '',
      telefono: item.telefono || ''
    });
    setEditando(item.id);
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar cliente?')) {
      await API.delete(`/clientes/${id}`);
      listar();
    }
  };

  return (
    <section className="card">
      <h2>CRUD Cliente</h2>

      <form onSubmit={guardar} className="formulario">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          placeholder="Correo"
          value={form.correo}
          onChange={e => setForm({ ...form, correo: e.target.value })}
          required
        />

        <input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
          required
        />

        <button>{editando ? 'Actualizar' : 'Guardar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.correo}</td>
              <td>{item.telefono}</td>
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