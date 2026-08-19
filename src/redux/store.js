import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from "redux-persist"
import { authTransform } from '../utils/authTransform'
import dashboardSlice from './slices/dashboardSlice'
import authSlice from './slices/authSlice'
import granttSlice from './slices/granttSlice'
import settingsSlice from './slices/settingSlice'
import inputSlice from './slices/inputSlice'
import resourceSlice from './slices/resourceSlice'
import profileSlice from './slices/profileSlice'
const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [authTransform],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    dashboard: dashboardSlice,
    grantt: granttSlice,
    complexity: settingsSlice,
    input: inputSlice,
    resource: resourceSlice,
    profile: profileSlice
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ],
      },
    }),
})

export const persistor = persistStore(store)

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch