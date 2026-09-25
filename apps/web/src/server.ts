import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

// const app = express();
// https://fastify.dev/docs/latest/Guides/Getting-Started/
const app = Fastify({
  logger: true,
});
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 */
app.register(fastifyStatic, {
  root: browserDistFolder,
  wildcard: false,
  index: false,
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', (req, reply) => {
  angularApp
    .handle(req.raw)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, reply.raw) : reply.callNotFound(),
    )
    .catch((err) => reply.send(err));
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = Number(process.env['PORT']) || 4000;
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    console.log(`Node Fastify server listening on ${address}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(async (req, res) => {
  await app.ready();
  app.server.emit('request', req, res);
});
