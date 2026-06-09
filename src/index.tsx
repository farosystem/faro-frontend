import { StrictMode, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  ApolloLink,
  from
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { configureStore } from './store/store.js';

import reportWebVitals from './reportWebVitals.js';
import App from './App.jsx';
import './i18n.jsx';

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URLSERVER,
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: token } : {})
    }
  };
});

const tokenRefreshLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const fetchResponse = context.response;
    const refreshedToken = fetchResponse?.headers?.get?.('x-faro-token');
    if (refreshedToken) {
      localStorage.setItem('token', refreshedToken);
    }
    return response;
  });
});

const client = new ApolloClient({
  link: from([authLink, tokenRefreshLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false
  })
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Provider store={configureStore({})}>
        <Fragment>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Fragment>
      </Provider>
    </ApolloProvider>
  </StrictMode>
);

// pass a performance logging callback if desired (or remove argument to silence)
reportWebVitals(console.log);
// serviceWorker.unregister();
