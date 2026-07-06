import type { DataProvider } from "@refinedev/core";
import { api, API_URL } from "../lib/api";
import { toHttpError } from "../lib/api-error";

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource, pagination, filters }) => {
    try {
      const currentPage = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params = new URLSearchParams();

      params.set("page", String(currentPage));
      params.set("limit", String(pageSize));

      filters?.forEach((filter) => {
        if (
          "field" in filter &&
          filter.value !== undefined &&
          filter.value !== null &&
          filter.value !== ""
        ) {
          params.set(String(filter.field), String(filter.value));
        }
      });

      const response = await api.get(`/${resource}?${params.toString()}`);

      return {
        data: response.data.data,
        total: response.data.pagination?.total ?? response.data.data.length,
      };
    } catch (error) {
      throw toHttpError(error);
    }
  },

  getOne: async ({ resource, id }) => {
    try {
      const response = await api.get(`/${resource}/${id}`);

      return {
        data: response.data.data,
      };
    } catch (error) {
      throw toHttpError(error);
    }
  },

  create: async ({ resource, variables }) => {
    try {
      const response = await api.post(`/${resource}`, variables);

      return {
        data: response.data.data,
      };
    } catch (error) {
      throw toHttpError(error);
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      const response = await api.patch(`/${resource}/${id}`, variables);

      return {
        data: response.data.data,
      };
    } catch (error) {
      throw toHttpError(error);
    }
  },

  deleteOne: async ({ resource, id }) => {
    try {
      const response = await api.delete(`/${resource}/${id}`);

      return {
        data: response.data.data,
      };
    } catch (error) {
      throw toHttpError(error);
    }
  },
};