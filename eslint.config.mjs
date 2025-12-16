import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import next from "eslint-config-next";

const eslintConfig = [...nextCoreWebVitals, ...next, ...compat.config({
  rules: {
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
  }
}), {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}]

export default eslintConfig
