import { useEffect, useState } from 'react';
import API from '../api';

export default function CompProveedor() {
  const [datos, setDatos] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    telefono: '',
    direccion: ''
  });
  const [editando, setEditando] = useState(null);

  const listar = async () => {
    const res = await API.get('/proveedores');
    setDatos(res.data);
  };

  useEffect(() => { listar(); }, []);

  const guardar = async (e) => {
    e.preventDefault();

    if (editando) await API.put(`/proveedores/${editando}`, form);
    else await API.post('/proveedores', form);

    setForm({ nombre: '', ruc: '', telefono: '', direccion: '' });
    setEditando(null);
    listar();
  };

  const editar = (item) => {
    setForm({
      nombre: item.nombre || '',
      ruc: item.ruc || '',
      telefono: item.telefono || '',
      direccion: item.direccion || ''
    });
    setEditando(item.id);
  };

  const eliminar = async (id) => {
    if (confirm('¿Eliminar proveedor?')) {
      await API.delete(`/proveedores/${id}`);
      listar();
    }
  };

  return (
    <section className="card">
      <h2>CRUD Proveedor</h2>

      <form onSubmit={guardar} className="formulario">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          required
        />

        <input
          placeholder="RUC"
          value={form.ruc}
          onChange={e => setForm({ ...form, ruc: e.target.value })}
          required
        />

        <input
          placeholder="Teléfono"
          value={form.telefono}
          onChange={e => setForm({ ...form, telefono: e.target.value })}
          required
        />

        <input
          placeholder="Dirección"
          value={form.direccion}
          onChange={e => setForm({ ...form, direccion: e.target.value })}
          required
        />

        <button>{editando ? 'Actualizar' : 'Guardar'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>RUC</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {datos.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.ruc}</td>
              <td>{item.telefono}</td>
              <td>{item.direccion}</td>
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