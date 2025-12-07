const BASE_URL = "http://localhost:4000/api";

// USERS
export async function registerUser(username: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

// NOTES
export async function getNotes(type: string, id: string | number) {
  const res = await fetch(`${BASE_URL}/notes/${type}/${id}`);
  return res.json();
}

export async function createNote(userId: string, text: string, targetType: string, targetId: string) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, text, targetType, targetId })
  });
  return res.json();
}

export async function deleteNote(id: string, userId: string) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  return res.json();
}

// COLLECTIONS
export async function createCollection(userId: string, name: string, artworks: string[], exhibitions: string[]) {
  const res = await fetch(`${BASE_URL}/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name, artworks, exhibitions })
  });
  return res.json();
}

export async function getMyCollections(userId: string) {
  const res = await fetch(`${BASE_URL}/collections/mine?userId=${userId}`);
  return res.json();
}

export async function updateCollection(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteCollection(id: string) {
  const res = await fetch(`${BASE_URL}/collections/${id}`, {
    method: "DELETE"
  });
  return res.json();
}
