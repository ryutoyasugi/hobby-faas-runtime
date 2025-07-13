import { promises as fs } from 'fs';
import path from 'path';

export type HandlerFunction = (req: Request) => Promise<any> | any;

const handlerPath = path.join(process.cwd(), 'functions', 'handler.ts');

export async function loadHandler(): Promise<HandlerFunction | null> {
  try {
    try {
      await fs.access(handlerPath);
    } catch {
      // File doesn't exist, try to write from environment variable
      await writeHandlerFromEnv();
    }

    // Load the handler file
    const handlerModule = await import(handlerPath);
    
    if (typeof handlerModule.handler === 'function') {
      return handlerModule.handler;
    } else {
      throw new Error('No handler function exported');
    }
  } catch (error) {
    console.error('Failed to load handler:', error);
    return null;
  }
}

async function writeHandlerFromEnv(): Promise<boolean> {
  const handlerCode = process.env['HANDLER_CODE'];
  if (!handlerCode) {
    return false;
  }
  try {
    // Write code to handler.ts
    await fs.writeFile(handlerPath, handlerCode, 'utf8');
    return true;
  } catch (error) {
    console.error('Failed to write handler from environment:', error);
    return false;
  }
}
