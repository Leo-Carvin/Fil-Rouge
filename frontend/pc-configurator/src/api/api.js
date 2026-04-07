const API_URL = "http://localhost:3001";

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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(build),
  });
  return res.json();
}