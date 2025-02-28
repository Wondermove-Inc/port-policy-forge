import cspellPlugin from "@cspell/eslint-plugin";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "dist",
      "public",
      "wasm-go",
      "src/App.tsx",
      "src/components/modules/networkgraph",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "writable",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
      "@cspell": cspellPlugin,
      import: importPlugin,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React and React Hooks rules
      "react-hooks/exhaustive-deps": "off",
      "react/prop-types": "off",
      "@next/next/no-img-element": "off",

      // TypeScript rules
      "@typescript-eslint/no-duplicate-enum-values": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Import rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-named-as-default": "off",

      // General JavaScript rules
      "no-console": "warn",
      "no-var": "error",
      "no-nested-ternary": "error",
      "max-depth": ["error", 6],
      "brace-style": ["error", "1tbs"],
      eqeqeq: ["error", "always"],
      "arrow-parens": ["error", "always"],

      // Spell checking
      "@cspell/spellchecker": [
        "error",
        {
          cspell: {
            words: ["skuber", "networkgraph"],
          },
        },
      ],

      // Prettier integration
      "prettier/prettier": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
      },
    },
  },
  prettierConfig,
];
