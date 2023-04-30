import { createApiClient } from "api";

export const api = createApiClient(import.meta.env.VITE_API_PREFIX);
