import { defineConfig, envField } from "astro/config";

export default defineConfig({
  env: {
    schema: {
      PUBLIC_GOOGLE_MAPS_API_KEY: envField.string({
        context: "server",
        access: "public",
        optional: true,
      }),
    },
  },
});
