import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// redux
import { Provider, useSelector, useDispatch } from 'react-redux';
import store, { persistor, history } from './store/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import { HistoryRouter as Router } from 'redux-first-history/rr6'; 
import Loading from './home/main/Loading'; 
import { persistStoreUpdate } from './store/reducer/actions'; 

const container = document.getElementById('root');
const root = createRoot(container);

const RootComponent = () => {
  const isLoading = useSelector((state) => state.root.loading.isLoading);
  const dispatch = useDispatch();

  // Lắng nghe sự kiện `storage` để đồng bộ dữ liệu giữa các tab
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'persist:root') {
        const updatedState = JSON.parse(event.newValue);
        if (updatedState) {
          dispatch(persistStoreUpdate(updatedState)); // Cập nhật state từ localStorage
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch]);

  return (
    <>
      {isLoading && <Loading />}
      <App />
    </>
  );
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <RootComponent />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
