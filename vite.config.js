import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/*.json', '**/brain/**', '**/.antigravity*']
    },
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.statusCode = 200;
          res.end();
          return;
        }

        const reqUrl = new URL(req.url, `http://${req.headers.host}`);
        const targetUrl = reqUrl.searchParams.get('url');
        const filename = reqUrl.searchParams.get('filename') || 'download.zip';

        if (!targetUrl) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing url parameter' }));
          return;
        }

        try {
          const response = await fetch(targetUrl);
          if (!response.ok) {
            res.statusCode = response.status;
            res.end(`Failed to fetch file: ${response.statusText}`);
            return;
          }
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(buffer);
        } catch (e) {
          res.statusCode = 500;
          res.end(`Proxy error: ${e.message}`);
        }
      });
    }
  }
})
