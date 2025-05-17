const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchBoard() {
  const res = await fetch(`${API_BASE}/board`);
  return res.json();
}

export async function updateTask(id, data) {
  await fetch(`${API_BASE}/task/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function createTask(data) {
  const res = await fetch(`${API_BASE}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id) {
  await fetch(`${API_BASE}/task/${id}`, { method: "DELETE" });
}
