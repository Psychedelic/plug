const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce(
  (acc, rule) => {
    acc[`jsx-a11y/${rule}`] = 'off';
    return acc;
  },
  {},
);

module.exports = {
  env: {
    webextensions: true,
    browser: true,
    es2022: true,
    node: true,
  },
  globals: {
    INPAGE_SCRIPT: 'readonly',
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    ...a11yOff,
    'react/react-in-jsx-scope': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'no-nested-ternary': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@ui', './source/ui'],
          ['@components', './source/components'],
          ['@modules', './source/Modules'],
          ['@assets', './source/assets'],
          ['@shared', './source/shared'],
          ['@hooks', './source/hooks'],
          ['@redux', './source/redux'],
          ['@background', './source/Background'],
        ],
      },
    },
  },
};
