import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider, InMemoryCache } from '@apollo/client';

import { configureStore } from '@/store/store';
import { ApolloClient } from '@apollo/client';

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URLSERVER,
  credentials: 'include',
  cache: new InMemoryCache({
    addTypename: false
  })
});

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={configureStore({})}>
      <ApolloProvider client={client}>
        <BrowserRouter>{ui}</BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
}
