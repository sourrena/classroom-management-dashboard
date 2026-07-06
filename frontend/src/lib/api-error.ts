import type { HttpError } from "@refinedev/core";
import axios from "axios";

type BackendErrorResponse = {
  success?: boolean;
  message?: string;
};

export const toHttpError = (error: unknown): HttpError => {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const statusCode = error.response?.status ?? 500;

    const message =
      error.response?.data?.message || error.message || "Request failed";

    return {
      message,
      statusCode,
    };
  }

  return {
    message: "Unexpected error",
    statusCode: 500,
  };
};