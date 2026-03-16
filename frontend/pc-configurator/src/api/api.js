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
  let url = `${API_URL}/build/${type}`;
  if (param) url += `/${param}`;
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