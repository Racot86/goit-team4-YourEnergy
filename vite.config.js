import { defineConfig } from 'vite';
import { glob } from 'glob';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';
import SortCss from 'postcss-sort-media-queries';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    root: 'src',
    build: {
      sourcemap: true,
      rollupOptions: {
        input: glob.sync('./src/*.html'),
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: assetInfo => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      injectHTML(),
      FullReload(['./src/**/**.html']),
      SortCss({
        sort: 'mobile-first',
      }),
      {
        name: 'save-tasks-handler',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/save-tasks' && req.method === 'POST') {
              try {
                const chunks = [];
                req.on('data', chunk => chunks.push(chunk));
                req.on('end', async () => {
                  const data = JSON.parse(Buffer.concat(chunks).toString());
                  const filePath = path.resolve(__dirname, 'src/data/task-manager.json');
                  await fs.writeFile(filePath, JSON.stringify(data, null, 4));
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true }));
                });
              } catch (error) {
                console.error('Error saving tasks:', error);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Failed to save tasks' }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
    server: {
      open: true,
      host: true,
    },
    css: {
      devSourcemap: true,
    },
  };
});
