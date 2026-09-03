// eslint-config-next/core-web-vitals already includes the base Next config.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "tools/imgkit/node_modules/**",
      "tools/_*/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
];

export default config;
