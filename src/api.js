const API_URL = import.meta.env.VITE_API_URL;

export async function getAllProducts() {
  const res = await fetch(`${API_URL}/products/all`);
  if (!res.ok) throw new Error('Error obteniendo productos');
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return res.json();
}

export async function getProductsByCategory(categoryId) {
  const res = await fetch(`${API_URL}/products/category/${categoryId}`);
  if (!res.ok) throw new Error('Error obteniendo productos por categoría');
  return res.json();
}

export async function saveProduct(product) {
  const res = await fetch(`${API_URL}/products/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Error guardando producto');
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/products/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error('Error actualizando producto');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/delete/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error eliminando producto');
}