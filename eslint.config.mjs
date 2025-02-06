import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node, // Ensures global Node.js variables are recognized
      parser: tseslint.parser, // Use TypeScript parser
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // ESLint recommended rules
      ...tseslint.configs.recommended.rules, // TypeScript recommended rules
      ...prettierConfig.rules, // Prettier recommended config

      "prettier/prettier": "error", // Enforce Prettier formatting
      "@typescript-eslint/no-unused-vars": ["warn"], // Warn on unused variables
      "@typescript-eslint/explicit-module-boundary-types": "off", // Disable explicit return types
    },
  },
];