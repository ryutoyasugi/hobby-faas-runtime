import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { loadHandler, type HandlerFunction } from './handler-loader.js';

const app = new Hono();

// Dynamic function loader
let dynamicHandler: HandlerFunction | null = null;

// Catch-all handler for all paths and methods
app.all('*', async (c) => {
  if (dynamicHandler) {
    try {
      const request = c.req.raw;
      const result = await dynamicHandler(request);
      return c.json(result);
    } catch (error) {
      console.error('Error executing handler:', error);
      return c.json({ error: 'Handler execution failed' }, 500);
    }
  } else {
    return c.json({ error: 'No handler loaded' }, 500);
  }
});

const port = parseInt(process.env.PORT || '3000');

async function startServer() {
  // Load handler on startup
  dynamicHandler = await loadHandler();
  
  console.log(`Starting FaaS Runtime on port ${port}`);
  serve({
    fetch: app.fetch,
    port
  });
}

startServer();
