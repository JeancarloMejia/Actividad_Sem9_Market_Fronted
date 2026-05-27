import { useEffect, useState } from 'react';
import {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
} from './api';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    categoryId: '',
    price: '',
    stock: '',
    active: true,
  });

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setError('');
    } catch (e) {
      setError(e.message || 'Error cargando productos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleEdit(product) {
    setEditing(product.productId);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      active: product.active,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      stock: Number(form.stock),
      active: form.active,
    };

    try {
      if (editing) {
        await updateProduct(editing, payload);
      } else {
        await saveProduct(payload);
      }
      setForm({
        name: '',
        categoryId: '',
        price: '',
        stock: '',
        active: true,
      });
      setEditing(null);
      await loadProducts();
      setError('');
    } catch (e) {
      setError(e.message || 'Error guardando producto');
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (e) {
      setError(e.message || 'Error eliminando producto');
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Market Dashboard</h1>

        <p>Administración de productos en tiempo real</p>

        <div className="header-links">
          <small>
            API:{' '}
            <a
              href="https://actividad-sem9-market.onrender.com/products/all"
              target="_blank"
              rel="noreferrer"
            >
              Backend URL
            </a>
          </small>

          <small>
            Swagger:{' '}
            <a
              href="https://actividad-sem9-market.onrender.com/swagger-ui/index.html#/"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
            </a>
          </small>

          <small>
            OpenAPI:{' '}
            <a
              href="https://actividad-sem9-market.onrender.com/v3/api-docs"
              target="_blank"
              rel="noreferrer"
            >
              JSON Docs
            </a>
          </small>
        </div>
      </header>

      <main className="app-main">
        <section className="panel panel-left">
          <h2>{editing ? 'Editar producto' : 'Nuevo producto'}</h2>
          <p className="panel-subtitle">
            Completa los datos para registrar un producto o selecciona uno de la
            tabla para actualizarlo.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-row">
                <label>Nombre</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Coca Cola 500ml"
                  required
                />
              </div>

              <div className="form-row">
                <label>Categoría</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona categoría</option>
                  <option value="1">Lácteos</option>
                  <option value="2">Panadería</option>
                  <option value="3">Bebidas</option>
                  <option value="4">Limpieza</option>
                  <option value="5">Snacks</option>
                </select>
              </div>

              <div className="form-row">
                <label>Precio</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ej. 3.50"
                  required
                />
              </div>

              <div className="form-row">
                <label>Stock</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Ej. 100"
                  required
                />
              </div>
            </div>

            <div className="switch-row">
              <span>Producto activo</span>
              <label>
                <input
                  name="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={handleChange}
                />{' '}
                Sí
              </label>
            </div>

            <div className="form-actions">
              {editing && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: '',
                      categoryId: '',
                      price: '',
                      stock: '',
                      active: true,
                    });
                  }}
                >
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary">
                {editing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>

            {error && <p className="text-error">{error}</p>}
          </form>
        </section>

        <section className="panel panel-right">
          <div className="table-header">
            <h2>Productos</h2>
            <span>
              {loading
                ? 'Cargando...'
                : `${products.length} producto(s) encontrados`}
            </span>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <p style={{ padding: 10 }}>Cargando...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.productId}>
                      <td>{p.productId}</td>
                      <td>{p.name}</td>
                      <td>
                        <span className="chip">
                          {p.category?.category || `Cat ${p.categoryId}`}
                        </span>
                      </td>
                      <td>S/ {p.price}</td>
                      <td>
                        <span
                          className={
                            p.stock <= 5
                              ? 'chip chip-stock-low'
                              : 'chip chip-stock-ok'
                          }
                        >
                          {p.stock} uds
                        </span>
                      </td>
                      <td>{p.active ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button
                          className="btn btn-outline"
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{
                            marginLeft: 6,
                            borderColor: '#fecaca',
                            color: '#b91c1c',
                          }}
                          onClick={() => handleDelete(p.productId)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && !loading && (
                    <tr>
                      <td colSpan="7" style={{ padding: 10 }}>
                        No hay productos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        Desarrollado por Jean Carlo Mejía · 2026
      </footer>
    </div>
  );
}

export default App;