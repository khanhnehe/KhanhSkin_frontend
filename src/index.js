import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// redux
import { Provider, useSelector } from 'react-redux';
import store, { persistor, history } from './store/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import { HistoryRouter as Router } from 'redux-first-history/rr6'; // Thay thế BrowserRouter
import Loading from './home/main/Loading'; // Import component Loading

const container = document.getElementById('root');
const root = createRoot(container); // Tạo root

const RootComponent = () => {
  const isLoading = useSelector((state) => state.root.loading.isLoading); // Truy cập trạng thái loading từ rootReducer

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
      <PersistGate persistor={persistor}>
        <Router history={history}> {/* Sử dụng HistoryRouter */}
          <RootComponent />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();