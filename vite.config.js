import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { isCountedPath } from './api/audience/logic.js'
import { readMemory, visitFlags } from './api/audience/memory.js'

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) return resolve({})
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function audienceDevPlugin() {
  return {
    name: 'audience-dev',
    configureServer(server) {
      server.middlewares.use('/api/audience', async (req, res, next) => {
        const pathname = (req.url || '/').split('?')[0]
        if (pathname !== '/' && pathname !== '') return next()
        if (req.method !== 'GET' && req.method !== 'POST') return next()
        res.setHeader('Content-Type', 'application/json')
        try {
          if (req.method === 'GET') {
            res.end(JSON.stringify(readMemory()))
            return
          }
          const body = await readJson(req)
          const path = typeof body.path === 'string' ? body.path : '/'
          const counted = isCountedPath(path)
          const view = visitFlags({
            incrementTotal: counted && body.incrementTotal === true,
            incrementToday: counted && body.incrementToday === true
          })
          res.end(JSON.stringify(view))
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Identificador inválido.' }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), audienceDevPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['tests/**', 'src/main.jsx']
    }
  }
})
