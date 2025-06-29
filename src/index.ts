import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import path from 'path';

const app = new Hono();

// Dynamic function loader
let dynamicHandler: ((c: Context) => Promise<Response>) | null = null;

async function loadHandler() {
  try {
    const handlerPath = path.join(process.cwd(), 'functions', 'handler.ts');
    const handlerModule = await import(handlerPath);
    dynamicHandler = handlerModule.handler;
  } catch (error) {
    console.error('Failed to load handler:', error);
    dynamicHandler = null;
  }
}

// Catch-all handler for all paths and methods
app.all('*', async (c) => {
  if (dynamicHandler) {
    try {
      return await dynamicHandler(c);
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
  await loadHandler();
  
  console.log(`Starting FaaS Runtime on port ${port}`);
  
  serve({
    fetch: app.fetch,
    port
  });
}

startServer();
