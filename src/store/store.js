import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers';
import rootSaga from './sagas';
import bookingReducer from './slices/booking';
import layoutReducer from './slices/layout';

const sagaMiddleware = createSagaMiddleware();

export function configureStoreRTK(initialState) {
  const store = configureStore({
    reducer: {
      ...rootReducer,
      booking: bookingReducer,
      layout: layoutReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      }).concat(sagaMiddleware),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production'
  });

  sagaMiddleware.run(rootSaga);
  return store;
}

// Keep the old function for backward compatibility
export { configureStoreRTK as configureStore };
