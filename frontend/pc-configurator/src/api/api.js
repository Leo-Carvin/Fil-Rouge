const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper token
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getComponents(type, options = {}) {
  let url = `${API_URL}/build/components/${type}`;
  const query = [];
  if (options.socket) query.push(`socket=${encodeURIComponent(options.socket)}`);
  if (options.ram_type) query.push(`ram_type=${encodeURIComponent(options.ram_type)}`);
  if (options.sort) query.push(`sort=${encodeURIComponent(options.sort)}`);
  if (query.length) url += `?${query.join("&")}`;
  const res = await fetch(url);
  return res.json();
}

export async function saveBuild(build) {
  const res = await fetch(`${API_URL}/build/save`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(build),
  });
  return res.json();
}

export async function createOrder(items) {
  const user_id = localStorage.getItem("user_id");
  const res = await fetch(`${API_URL}/orders/create`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ user_id, items }),
  });
  return res.json();
}

export async function getUserOrders() {
  const user_id = localStorage.getItem("user_id");
  const res = await fetch(`${API_URL}/orders/user/${user_id}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.append("type", filters.type);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);
  const res = await fetch(`${API_URL}/products?${params.toString()}`);
  return res.json();
}

export async function getAdminStats() {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getAdminOrders() {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function updateProduct(id, data) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${API_URL}/cart`, { headers: authHeaders() });
  return res.json();
}

export async function addCartItem(product_id, quantity) {
  const res = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ product_id, quantity }),
  });
  return res.json();
}

export async function removeCartItem(product_id) {
  const res = await fetch(`${API_URL}/cart/${product_id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}

export async function clearCartAPI() {
  const res = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
}
