import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // disable 'any' rule
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": false, // allow ts-ignore
          "ts-expect-error": false, // allow ts-expect-error
        },
      ],
      // Reduce React hooks dependency warnings to warnings instead of errors
      "react-hooks/exhaustive-deps": "warn",
      // Allow img elements with warning instead of error for gradual migration
      "@next/next/no-img-element": "warn",
      // Allow unused variables with underscore prefix
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_" 
      }],
      // Development-friendly settings
      "prefer-const": "warn",
      "no-console": "warn",
    },
  },
];

export default eslintConfig;
