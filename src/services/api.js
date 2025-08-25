// URL till servern
export const BASE_URL = "https://chatify-api.up.railway.app";

// Hämta token som redan är sparad i localStorage efter login)
const getToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth") || "null");
  return auth?.token || null;
};

// Hämta CSRF (behövs innan POST/PUT/DELETE)
export async function getCsrfToken() {
  const res = await fetch(`${BASE_URL}/csrf`, {
    method: "PATCH",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Could not fetch CSRF (HTTP ${res.status})`);
  }

  const data = await res.json();
  console.log("✅ CSRF-token hämtad:", data.csrfToken);
  return data.csrfToken;
}

// Registrera user
export async function registerUser({ username, password, email }) {
  const csrf = await getCsrfToken();

  const DEFAULT_AVATAR = "https://i.pravatar.cc/200";

  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrf,
    },
    body: JSON.stringify({
      username,
      password,
      email,
      avatar: DEFAULT_AVATAR,
      csrfToken: csrf,
    }),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }
  if (!res.ok) {
    // felmeddelande från API:t
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
}

// 3) Logga in (returnerar { token })
export async function loginUser({ username, password }) {
  const csrf = await getCsrfToken();
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrf,
    },
    body: JSON.stringify({ username, password, csrfToken: csrf }),
  });
  let data;
  try {
    data = await res.json();
  } catch (err) {
    data = {};
  }
  if (!res.ok) {
    const msg = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  const meRes = await fetch(`${BASE_URL}/users/${data.id}`, {
    headers: { Authorization: `Bearer ${data.token}` },
    credentials: "include",
  });
  let me;
  try {
    me = await meRes.json();
  } catch (err) {
    me = {};
  }

  return {
    ...data,
    username: me.username,
  };
}
console.log(
  "💾 Sparat i localStorage:",
  JSON.parse(localStorage.getItem("auth"))
);

export async function fetchMessages() {
  const token = getToken();
  if (!token) throw new Error("Inte inloggad");
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  return data; // array av messages
}

// 5) Skapa meddelande
export async function postMessage({ text }) {
  const token = getToken();
  if (!token) throw new Error("Inte inloggad");
  const csrf = await getCsrfToken();
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-CSRF-TOKEN": csrf,
    },
    body: JSON.stringify({ text }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
  const msg = data.latestMessage ?? data;
  return msg;
}

// 6) Radera meddelande
export async function deleteMessageById(msgId) {
  const token = getToken();
  if (!token) throw new Error("Inte inloggad");
  const csrf = await getCsrfToken();
  const res = await fetch(`${BASE_URL}/messages/${encodeURIComponent(msgId)}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-CSRF-TOKEN": csrf,
    },
  });
  if (!res.ok) {
    // vissa DELETE kan sakna JSON-svar -> läs text om json saknas
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  return true; // räcker i UI:et
}

/* ===================== USERS ====================== */

// 7) Hämta alla användare (enkel variant utan extra params)
//  export async function getUsers() {
//    const token = getToken();
//    if (!token) throw new Error("Inte inloggad");
//    const res = await fetch(`${BASE_URL}/users`, {
//      headers: { Authorization: `Bearer ${token}` },
//      credentials: "include",
//    });
//    const data = await res.json().catch(() => ({}));
//    if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
//    return data;
//  }

// // 8) Hämta specifik användare
// export async function getUserById(userId) {
//   const token = getToken();
//   if (!token) throw new Error("Inte inloggad");
//   const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
//     headers: { Authorization: `Bearer ${token}` },
//     credentials: "include",
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
//   return data;
// }

// // 9) Uppdatera inloggad användare
// export async function updateCurrentUser({ username, email, avatar }) {
//   const token = getToken();
//   if (!token) throw new Error("Inte inloggad");
//   const csrf = await getCsrfToken();
//   const res = await fetch(`${BASE_URL}/user`, {
//     method: "PUT",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//       "X-CSRF-TOKEN": csrf,
//     },
//     body: JSON.stringify({ username, email, avatar }),
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}`);
//   return data;
// }

// // 10) Radera användare (admin eller egen – beror på API-regler)
// export async function deleteUserById(userId) {
//   const token = getToken();
//   if (!token) throw new Error("Inte inloggad");
//   const csrf = await getCsrfToken();
//   const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(userId)}`, {
//     method: "DELETE",
//     credentials: "include",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "X-CSRF-TOKEN": csrf,
//     },
//   });
//   if (!res.ok) {
//     let msg = `HTTP ${res.status}`;
//     try {
//       const data = await res.json();
//       msg = data?.message || msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   return true;
// }
