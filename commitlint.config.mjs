const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "style", "design", "docs", "test", "chore"],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
  },
};

export default config;
