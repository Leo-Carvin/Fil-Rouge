const API_URL = "http://localhost:3000";

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

export async function getComponents(type, param = "") {
  let url = `${API_URL}/build/components/${type}`;
  const query = [];
  if (type === "Motherboard" && param) {
    query.push(`socket=${encodeURIComponent(param)}`);
  }
  if (type === "RAM" && param) {
    query.push(`ram_type=${encodeURIComponent(param)}`);
  }
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