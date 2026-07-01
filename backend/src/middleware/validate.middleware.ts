import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

export const validateRequestBody = (schema: ZodSchema): RequestHandler => {
  return (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
  };
};