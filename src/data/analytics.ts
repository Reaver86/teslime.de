export const analyticsEnabled = Boolean(import.meta.env?.PROD && import.meta.env?.PUBLIC_ANALYTICS_ENABLED === "true");
