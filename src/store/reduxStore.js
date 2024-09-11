import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import rootReducer from './reducer/rootReducer';

const {
    createReduxHistory,
    routerMiddleware,
    routerReducer
} = createReduxHistoryContext({
    history: createBrowserHistory()
});

const store = configureStore({
    reducer: {
        root: rootReducer, // Sử dụng rootReducer đã được xử lý với persistReducer cho từng reducer
        router: routerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
                ignoredPaths: ['user.someNonSerializableField'], // Bỏ qua các trường không thể lưu trữ
            },
        }).concat(routerMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});

let persistor = persistStore(store);
const history = createReduxHistory(store);

export default store;
export { persistor, history };
