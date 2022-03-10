module.exports = {
  env: {
    browser: true,
    commonjs: true,
    webextensions: true
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off'
  },
};
