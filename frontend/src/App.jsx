import { useState } from 'react';
import CompCategoria from './components/CompCategoria.jsx';
import CompProducto from './components/CompProducto.jsx';
import CompCliente from './components/CompCliente.jsx';
import CompProveedor from './components/CompProveedor.jsx';

export default function App() {
  const [vista, setVista] = useState('categorias');

  const botones = [
    { id: 'categorias', texto: 'Categorías' },
    { id: 'productos', texto: 'Productos' },
    { id: 'clientes', texto: 'Clientes' },
    { id: 'proveedores', texto: 'Proveedores' }
  ];

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="badge">Práctica calificada de Frontend</p>
          <h1>APP CRUD</h1>
        </div>
      </section>

      <nav className="menu">
        {botones.map((b) => (
          <button key={b.id} className={vista === b.id ? 'activo' : ''} onClick={() => setVista(b.id)}>
            {b.texto}
          </button>
        ))}
      </nav>

      {vista === 'categorias' && <CompCategoria />}
      {vista === 'productos' && <CompProducto />}
      {vista === 'clientes' && <CompCliente />}
      {vista === 'proveedores' && <CompProveedor />}
    </main>
  );
}
