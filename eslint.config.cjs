// eslint.config.cjs
module.exports = [
  {
    ignores: ['node_modules/**', 'build/**', 'dist/**']
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        React: 'readonly'
      }
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      prettier: require('eslint-plugin-prettier')
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error'
      // add your custom rules here
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
];
