import "dotenv/config";
import express from "express";
import fetch from "node-fetch";

const app  = express();
const PORT = process.env.PORT || 8080;

const API_KEY    = process.env.SDN_API_KEY;
const PROJECT_ID = process.env.SDN_PROJECT_ID;
const BASE_URL   = "https://sdn.3qsdn.com/api/v2";

if (!API_KEY || !PROJECT_ID) {
  console.error("Fehler: SDN_API_KEY und SDN_PROJECT_ID müssen in der .env gesetzt sein.");
  process.exit(1);
}

// Statische HTML-Dateien ausliefern
app.use(express.static("."));

// Proxy-Endpunkte – API-Key bleibt serverseitig
app.get("/api/videos", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/files`, {
      headers: { "X-AUTH-APIKEY": API_KEY, "Accept": "application/json" }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `API-Fehler: ${response.statusText}` });
    }
    res.json(await response.json());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/videos/:fileId", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/projects/${PROJECT_ID}/files/${req.params.fileId}`, {
      headers: { "X-AUTH-APIKEY": API_KEY, "Accept": "application/json" }
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `API-Fehler: ${response.statusText}` });
    }
    res.json(await response.json());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get("/api/videos/:fileId/embed", async (req, res) => {
  try {
    const response = await fetch(
      `${BASE_URL}/projects/${PROJECT_ID}/files/${req.params.fileId}/playouts/default/embed`,
      { headers: { "X-AUTH-APIKEY": API_KEY, "Accept": "application/json" } }
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: `API-Fehler: ${response.statusText}` });
    }
    res.json(await response.json());
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
