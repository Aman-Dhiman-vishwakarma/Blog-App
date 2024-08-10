import {combineReducers, configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import themeSlice from "./themeSlice";


const rootReducer = combineReducers({
    user:userSlice.reducer,
    theme:themeSlice.reducer,
})

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck:false}),
})

export default store;
export const persistor = persistStore(store)