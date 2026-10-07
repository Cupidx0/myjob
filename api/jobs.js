// Vercel serverless function: GET /api/jobs
import { searchJobs } from "../server/adzuna.js";

export default async function handler(req, res) {
  const { status, body } = await searchJobs(req.query || {}, process.env);
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  res.status(status).json(body);
}
