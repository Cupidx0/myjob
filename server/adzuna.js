// Server-side Adzuna search. Runs in the Vercel function (api/jobs.js) and the
// Vite dev server, so the Adzuna key never reaches the browser.
// Keep in sync with functions/index.js (Firebase can't import files outside functions/).

const COUNTRY = "gb";
const RESULTS_PER_PAGE = 20;
const FLAG_PARAMS = ["full_time", "part_time", "contract", "permanent"];

export function buildAdzunaUrl(query, appId, appKey) {
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

// Returns { status, body } so each host can send it its own way.
export async function searchJobs(query, env) {
  const appId = env.ADZUNA_APP_ID;
  const appKey = env.ADZUNA_APP_KEY;
  if (!appId || !appKey) {
    return { status: 500, body: { error: "ADZUNA_APP_ID / ADZUNA_APP_KEY are not set on the server." } };
  }
  try {
    const response = await fetch(buildAdzunaUrl(query, appId, appKey));
    if (!response.ok) {
      return { status: response.status, body: { error: `Adzuna responded with ${response.status}` } };
    }
    const data = await response.json();
    return { status: 200, body: { results: data.results || [], count: data.count || 0 } };
  } catch (error) {
    return { status: 502, body: { error: `Could not reach Adzuna: ${error.message}` } };
  }
}
