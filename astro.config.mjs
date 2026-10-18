import { defineConfig, envField } from "astro/config";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://www.teslime.de",
  base: process.env.BASE_PATH ?? "/",
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
