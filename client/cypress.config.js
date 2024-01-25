import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5174",
    env: {
      credentials: {
        username: "gary.cole@example.com",
        password: "pAssw0rd",
      },
    },
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
