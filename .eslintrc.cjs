module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  rules: {
    "no-var": "error",
    semi: "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "no-multiple-empty-lines": "error",
    "prefer-const": "error",

    // Possible Errors
    "no-console": "warn",
    "no-dupe-keys": "error",
    // "no-undef": "error",
    // "no-unused-vars": "warn",

    // Best Practices
    "eqeqeq": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-iterator": "error",
    "no-useless-call": "error",

    // Variables
    "no-shadow": "error",
    "no-shadow-restricted-names": "error",
    "no-undef-init": "error",

    "comma-spacing": "error",
    "space-before-blocks": "error",
    "brace-style": ["error", "1tbs"], // or "allman"
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],

    // ES6 Features
    "arrow-spacing": "error",
    "no-class-assign": "error",
    "no-const-assign": "error",
    "no-dupe-class-members": "error",

  },
  "plugins": [
    "@typescript-eslint"
  ]
};
