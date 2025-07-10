# Hobby FaaS Runtime

A lightweight Function as a Service (FaaS) runtime built with TypeScript and Hono. This project provides a simple yet flexible platform for running serverless functions with dynamic loading capabilities.

## Features

- **Dynamic Function Loading**: Load functions at runtime
- **Web Standard APIs**: Uses native Web Request APIs for function contracts
- **TypeScript Support**: TypeScript support with type safety
- **Lightweight**: Built on top of Hono for minimal overhead

## Quick Start

### Prerequisites

- Node.js 24+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:ryutoyasugi/hobby-faas-runtime.git
cd hobby-faas-runtime

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Execution
curl localhost:3000
```

## Writing Functions

Functions are stored in the `functions/` directory and follow a simple contract:

```typescript
// functions/handler.ts
export function handler(req: Request) {
  return {
    message: 'Hello from your function!',
    url: req.url,
    timestamp: new Date().toISOString(),
  };
}
```

### Function Contract

- **Input**: Web standard `Request` object
- **Output**: Any serializable JavaScript object
- **Execution**: Functions are executed for all HTTP methods and paths
