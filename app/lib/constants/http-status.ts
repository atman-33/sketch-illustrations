export const HTTP_STATUS = {
  ok: 200,
  noContent: 204,
  badRequest: 400,
  notFound: 404,
  methodNotAllowed: 405,
  internalServerError: 500,
} as const;

export type HttpStatusKey = keyof typeof HTTP_STATUS;
export type HttpStatusCode = (typeof HTTP_STATUS)[HttpStatusKey];
