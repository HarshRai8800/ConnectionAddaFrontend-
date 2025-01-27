import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./context"; // Import your counter slice reducer
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Redux Persist Configuration
const persistConfig = {
  key: "root", // Key for localStorage
  storage,
};

// Wrap the counterReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, counterReducer);

// Configure Store
export const store = configureStore({
  reducer: {
    counter: persistedReducer, // Use a meaningful key like "counter"
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);

// Define RootState type (state of the entire store)
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type (dispatch function with middleware support)
export type AppDispatch = typeof store.dispatch;

