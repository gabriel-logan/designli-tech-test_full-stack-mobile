module.exports = {
  root: true,
  extends: ["@react-native", "plugin:prettier/recommended"],
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
