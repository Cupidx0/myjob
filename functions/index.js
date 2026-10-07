// Firebase Cloud Function: GET /api/jobs (wired up by the rewrite in firebase.json).
// Same logic as server/adzuna.js, copied because Firebase only deploys this folder.
// Set the keys in functions/.env (ADZUNA_APP_ID=..., ADZUNA_APP_KEY=...).
import { onRequest } from "firebase-functions/v2/https";

const COUNTRY = "gb";
const RESULTS_PER_PAGE = 20;
const FLAG_PARAMS = ["full_time", "part_time", "contract", "permanent"];

function buildAdzunaUrl(query, appId, appKey) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    results_per_page: String(RESULTS_PER_PAGE),
  });
  if (query.what) params.set("what", String(query.what));
  if (query.where) params.set("where", String(query.where));
  for (const flag of FLAG_PARAMS) {
    if (query[flag] === "1") params.set(flag, "1");
  }
  for (const key of ["salary_min", "salary_max"]) {
    const value = parseInt(query[key], 10);
    if (value > 0) params.set(key, String(value));
  }
  return `https://api.adzuna.com/v1/api/jobs/${COUNTRY}/search/${page}?${params}`;
}

export const jobs = onRequest(async (req, res) => {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    res.status(500).json({ error: "ADZUNA_APP_ID / ADZUNA_APP_KEY are not set on the server." });
    return;
  }
  try {
    const response = await fetch(buildAdzunaUrl(req.query, appId, appKey));
    if (!response.ok) {
      res.status(response.status).json({ error: `Adzuna responded with ${response.status}` });
      return;
    }
    const data = await response.json();
    res.set("Cache-Control", "public, max-age=300, s-maxage=300");
    res.json({ results: data.results || [], count: data.count || 0 });
  } catch (error) {
    res.status(502).json({ error: `Could not reach Adzuna: ${error.message}` });
  }
});
