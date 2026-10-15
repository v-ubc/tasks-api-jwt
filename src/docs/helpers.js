
import { z } from 'zod';

export function toSchema(zodSchema, io = 'input') {
  const { $schema, ...jsonSchema } = z.toJSONSchema(zodSchema, { io });
  return jsonSchema;
}

export const jsonBody = (schema) => ({
  required: true,
  content: { 'application/json': { schema } },
});

export const jsonResponse = (description, schema) => ({
  description,
  content: { 'application/json': { schema } },
});

export const errorResponse = (description) =>
  jsonResponse(description, {
    $ref: '#/components/schemas/Error',
  });

export const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 },
};

export function secure(paths) {
  const result = {};

  for (const [path, item] of Object.entries(paths)) {
    result[path] = {};

    for (const [key, value] of Object.entries(item)) {
      result[path][key] =
        key === 'parameters'
          ? value
          : {
              ...value,
              security: [{ bearerAuth: [] }],
              responses: {
                ...value.responses,
                401: errorResponse('Token faltante, invalido o expirado'),
              },
            };
    }
  }

  return result;
}
