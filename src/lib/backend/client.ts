import createClient from "openapi-fetch";

import type { paths } from "@/lib/backend/apiV1/schema";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/"
    : "https://api.ddobang.site/";

const client = createClient<paths>({
  baseUrl,
  credentials: "include",
});
export default client;
