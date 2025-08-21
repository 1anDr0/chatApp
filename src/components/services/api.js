export const BASE_URL = "https://chatify-api.up.railway.app";

/**
 * getCsrfToken
 * ----------------------------
 * Hämtar en "CSRF-lapp" från servern.
 * Varför? Servern vill se denna lapp vid POST/DELETE för säkerhet.
 * - method: PATCH (enligt uppgiften)
 * - credentials: "include" => skicka med cookies fram/tilbaka (krävs för CSRF)
 */
const getCsrfToken = async () => {
  const res = await fetch(`${BASE_URL}/csrf`, {
    method: "PATCH",
    credentials: "include",
  });

  // Om något går fel: kasta ett lättläst fel
  if (!res.ok) {
    throw new Error(`Kunde inte hämta CSRF (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data?.csrfToken; // kan vara undefined om servern inte svarar korrekt
};

/**
 * fetchMessages
 * ----------------------------
 * Hämtar ALLA meddelanden från servern (GET /messages).
 * - token: din hemliga nyckel (JWT). Utan den kan servern säga 401.
 * Returnerar alltid en array (även om API:t skulle wrappa i {data: [...]})
 */
export const fetchMessages = async (token) => {
  const res = await fetch(`${BASE_URL}/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Lägg till Authorization-headern om vi har token
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include", // skicka med cookies (bra standard mot detta API)
  });

  if (!res.ok) {
    // 401 = inte inloggad/utgången token => ge en snäll text
    if (res.status === 401) {
      throw new Error("Inte inloggad eller sessionen har gått ut.");
    }
    throw new Error(`Kunde inte hämta meddelanden (HTTP ${res.status})`);
  }

  const data = await res.json();
  // API:t kan ibland ge direkt array eller { data: [...] } – vi säkrar en array
  return Array.isArray(data) ? data : data?.data || [];
};

/**
 * postMessage
 * ----------------------------
 * Skickar in ett nytt meddelande (POST /messages).
 * Viktigt:
 *  - Du bör ha SANITERAT texten innan du anropar denna (t.ex. ta bort HTML-taggar).
 *  - Kräver både JWT (Authorization) och CSRF (X-CSRF-Token).
 */
export const postMessage = async (token, message) => {
  if (!token) throw new Error("Saknar token – du är inte inloggad.");

  // Hämta CSRF-lappen först
  const csrf = await getCsrfToken();

  const res = await fetch(`${BASE_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-CSRF-Token": csrf, // visa upp CSRF-lappen för servern
    },
    credentials: "include",
    body: JSON.stringify({ message }), // själva texten som ska sparas
  });

  if (!res.ok) {
    throw new Error(`Kunde inte skicka meddelandet (HTTP ${res.status})`);
  }

  // Inget behov att returnera något speciellt här – vi kan ladda om listan efteråt
  return true;
};

/**
 * deleteMessageById
 * ----------------------------
 * Raderar ett meddelande med visst id (DELETE /messages/{id}).
 * Kräver både JWT och CSRF.
 */
export const deleteMessageById = async (token, msgId) => {
  if (!token) throw new Error("Saknar token – du är inte inloggad.");
  if (!msgId) throw new Error("Saknar meddelande-id.");

  const csrf = await getCsrfToken();

  const res = await fetch(`${BASE_URL}/messages/${msgId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-CSRF-Token": csrf,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Kunde inte radera meddelandet (HTTP ${res.status})`);
  }

  return true;
};
