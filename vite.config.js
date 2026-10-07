import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { searchJobs } from './server/adzuna.js'

// Serves /api/jobs during `npm run dev` / `npm run preview`, mirroring the
// Vercel function and Firebase function used in production.
function adzunaApi(env) {
  const middleware = async (req, res, next) => {
    if (!req.url.startsWith('/api/jobs')) return next()
    const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
    const { status, body } = await searchJobs(query, env)
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(body))
  }
  return {
    name: 'adzuna-api',
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { server.middlewares.use(middleware) },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix loads non-VITE_ vars too; they stay server-side and are never bundled.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), adzunaApi(env)],
  }
})
