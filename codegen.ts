import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: [
    'src/services/**/*.js',
    '!src/services/channex/**',
    '!src/services/PagoParcialService.js',
    '!src/services/ParametrosGeneralesService.js'
  ],
  generates: {
    './src/gql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations']
    }
  }
};

export default config;
