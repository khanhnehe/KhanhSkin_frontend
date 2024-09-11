import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// redux
import { Provider } from 'react-redux';
import store, { persistor, history } from './store/reduxStore';
import { PersistGate } from 'redux-persist/integration/react';
import { HistoryRouter as Router } from 'redux-first-history/rr6'; // Thay thế BrowserRouter

const container = document.getElementById('root');
const root = createRoot(container); // Tạo root

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}> {/* Sử dụng HistoryRouter */}
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();