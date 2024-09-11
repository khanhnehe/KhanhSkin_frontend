import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import rootReducer from './reducer/rootReducer'; // Đảm bảo đường dẫn đúng

const {
    createReduxHistory,
    routerMiddleware,
    routerReducer
} = createReduxHistoryContext({
    history: createBrowserHistory()
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'admin'], // Chỉ lưu trữ các reducer cần thiết
};

const persistedReducer = persistReducer(persistConfig, rootReducer());

const store = configureStore({
    reducer: {
        root: persistedReducer,
        router: routerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
                ignoredPaths: ['user.someNonSerializableField'],
            },
        }).concat(routerMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});

let persistor = persistStore(store);
const history = createReduxHistory(store);

export default store;
export { persistor, history };
