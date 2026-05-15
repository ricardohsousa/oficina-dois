import type { Server } from 'node:http';

import 'dotenv/config';

import { createApp } from './app';

const DEFAULT_PORT = 3000;
const rawPort = process.env.PORT?.trim();
const port = rawPort ? Number(rawPort) : DEFAULT_PORT;
const jwtSecret = process.env.JWT_SECRET?.trim();

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Invalid PORT value. Use an integer between 1 and 65535.');
  process.exit(1);
}

if (!jwtSecret) {
  console.error('JWT_SECRET environment variable is required.');
  process.exit(1);
}

const app = createApp({
  jwtSecret
});

const server: Server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error('Failed to start server.', error);
  }

  process.exit(1);
});
