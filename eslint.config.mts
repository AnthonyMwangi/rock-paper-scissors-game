import { FixupPluginDefinition, fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tsEslintConfig from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "public/**",
      "build/**",
      "dist/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    plugins: {
      js,
      prettier: prettierPlugin,
    },

    extends: ["js/recommended", ...tsEslintConfig.configs.recommended],

    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },

    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "error",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    plugins: {
      react: fixupPluginRules(pluginReact as FixupPluginDefinition),
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReact.configs.flat["jsx-runtime"].rules,
    },
  },
  pluginReactHooks.configs.flat.recommended,
]);
