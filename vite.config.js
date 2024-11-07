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
      middlewares: {
        handle: async (req, res, next) => {
          if (req.url === '/api/upload-image' && req.method === 'POST') {
            try {
              const chunks = [];
              req.on('data', chunk => chunks.push(chunk));
              req.on('end', async () => {
                const data = JSON.parse(Buffer.concat(chunks).toString());
                const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                
                // Создаем уникальное имя файла
                const fileName = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
                const filePath = path.resolve(__dirname, 'src/img/editor-images', fileName);
                
                // Создаем папку, если её нет
                await fs.mkdir(path.resolve(__dirname, 'src/img/editor-images'), { recursive: true });
                
                // Сохраняем файл
                await fs.writeFile(filePath, buffer);
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 
                  success: true,
                  filePath: `/img/editor-images/${fileName}`
                }));
              });
            } catch (error) {
              console.error('Error saving image:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Failed to save image' }));
            }
          } else if (req.url === '/api/get-images') {
            try {
              const imagesDir = path.join(process.cwd(), 'src', 'img', 'editor-images');
              const files = await fs.readdir(imagesDir);
              
              // Формируем список изображений
              const images = files
                .filter(file => /\.(jpg|jpeg|png|gif|jfif)$/i.test(file))
                .map(file => ({
                  name: file,
                  path: `./img/editor-images/${file}`
                }));

              // Отправляем только JSON
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ images }));
            } catch (error) {
              console.error('Error reading images directory:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
            }
          } else {
            next();
          }
        }
      }
    },
    css: {
      devSourcemap: true,
    },
  };
});
