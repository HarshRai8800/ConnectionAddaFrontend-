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
      // Disable no-explicit-any rule
      "@typescript-eslint/no-explicit-any": "off",

      // Customize unused variable rule to ignore variables prefixed with '_'
      "@typescript-eslint/no-unused-vars": [
        "warn", // Set to "warn" or "off" if you prefer
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_", // Ignore arguments starting with "_"
        },
      ],
    },
  },
];

export default eslintConfig;

