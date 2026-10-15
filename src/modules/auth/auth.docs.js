import { errorResponse, jsonBody, jsonResponse, secure, toSchema } from '../../docs/helpers.js';
import { credentialsSchema } from './auth.schema.js';

const credentials = {
  $ref: '#/components/schemas/Credentials',
};

const user = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    email: { type: 'string', format: 'email' },
  },
};

export const authDocs = {
  tags: [
    { name: 'Auth', description: 'Registro, login y usuario actual' },
  ],

  schemas: {
    Credentials: toSchema(credentialsSchema),
  },

  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un usuario',
        requestBody: jsonBody(credentials),
        responses: {
          201: jsonResponse('Usuario creado', user),
          400: errorResponse('Datos invalidos'),
          409: errorResponse('El email ya esta registrado'),
        },
      },
    },

    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesion y obtener un token',
        requestBody: jsonBody(credentials),
        responses: {
          200: jsonResponse('Token de acceso', {
            type: 'object',
            properties: {
              accessToken: { type: 'string' },
              tokenType: { type: 'string', example: 'Bearer' },
              expiresIn: { type: 'string', example: '1h' },
            },
          }),
          400: errorResponse('Datos invalidos'),
          401: errorResponse('Credenciales invalidas'),
        },
      },
    },

    ...secure({
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Obtener usuario autenticado',
          responses: {
            200: jsonResponse('Usuario autenticado', user),
          },
        },
      },
    }),
  },
};
