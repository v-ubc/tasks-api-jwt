import { healthDocs } from '../modules/health/health.docs.js';
import { authDocs } from '../modules/auth/auth.docs.js';
import { tasksDocs } from '../modules/tasks/tasks.docs.js';

const modules = [healthDocs, authDocs, tasksDocs];

export function buildOpenApiSpec() {
  return {
    openapi: '3.1.0',

    info: {
      title: 'Tasks API',
      version: '1.0.0',
      description: 'API REST en Express con Supabase y autenticacion JWT.',
    },

    servers: [
      { url: '/api' },
    ],

    tags: modules.flatMap((m) => m.tags),

    paths: Object.assign(
      {},
      ...modules.map((m) => m.paths)
    ),

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Datos invalidos',
                },
                details: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      field: { type: 'string' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
              required: ['message'],
            },
          },
        },

        ...Object.assign(
          {},
          ...modules.map((m) => m.schemas ?? {})
        ),
      },
    },
  };
}

