module.exports = {
  root: true,
  extends: ["@react-native", "plugin:prettier/recommended"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  plugins: ["simple-import-sort", "import"],
  rules: {
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          [String.raw`^\u0000`],
          [String.raw`^@?\w`],
          ["^@company/"],
          ["^"],
          [String.raw`^\.`],
        ],
      },
    ],
  },
};
