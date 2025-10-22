// server.js
import jsonServer from "json-server";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Rewrites (usa routes.json si existe)
const routesPath = path.join(__dirname, "routes.json");
try {
  server.use(jsonServer.rewriter(routesPath));
} catch (_) {
  // Si no hay routes.json, sigue normal
}

// Middlewares base (CORS, static, logger)
server.use(middlewares);

// Delay opcional para simular latencia
server.use((req, res, next) => {
  setTimeout(next, 150);
});

// Parseo de body para POST/PUT/PATCH
server.use(jsonServer.bodyParser);

// Healthcheck simple
server.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

/**
 * Endpoint custom: obtener sólo los prerequisitos de una feat
 * GET /api/feats/:id/prerequisitos
 */
server.get("/api/feats/:id/prerequisitos", (req, res) => {
  const id = Number(req.params.id);
  const db = router.db; // lowdb instance
  const feat = db.get("feats").find({ id }).value();

  if (!feat) return res.status(404).json({ error: "Feat no encontrada" });

  res.json({
    id: feat.id,
    code: feat.code,
    nombre: feat.nombre,
    preRequisitos: feat.preRequisitos ?? []
  });
});

/**
 * Endpoint custom: búsqueda avanzada
 * GET /api/feats/advanced-search?code=POWER_ATTACK&atributo=Fuerza&min=13&fuente=Manual
 * - code: match exacto
 * - q: full-text (usa json-server de base si preferís /feats?q=...)
 * - atributo + min: filtra prerequisitos por estadística mínima
 * - fuente: contiene
 */
server.get("/api/feats/advanced-search", (req, res) => {
  const { code, q, atributo, min, fuente } = req.query;
  const db = router.db;
  let feats = db.get("feats").value();

  if (code) {
    feats = feats.filter(f => (f.code || "").toLowerCase() === String(code).toLowerCase());
  }

  if (q) {
    const qq = String(q).toLowerCase();
    feats = feats.filter(f =>
      [f.nombre, f.nombreOriginal, f.descripcion, f.beneficio, f.especial, f.fuente, f.code]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(qq))
    );
  }

  if (fuente) {
    const ff = String(fuente).toLowerCase();
    feats = feats.filter(f => String(f.fuente || "").toLowerCase().includes(ff));
  }

  if (atributo || min) {
    const minVal = Number(min) || 0;
    feats = feats.filter(f =>
      Array.isArray(f.preRequisitos) &&
      f.preRequisitos.some((p) =>
        (p.tipo === "estadistica" || p.tipo === "atributo") &&
        (!atributo || String(p.atributo).toLowerCase() === String(atributo).toLowerCase()) &&
        (p.valor ?? 0) >= minVal
      )
    );
  }

  res.json(feats);
});

// (Opcional) Auto-timestamps en POST
server.post("/api/feats", (req, _res, next) => {
  req.body.createdAt = Date.now();
  next();
});

// Usa el router al final (CRUD estándar)
server.use("/api", router);

// Arranque
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`JSON Server corriendo en http://localhost:${PORT}`);
});
