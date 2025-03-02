import * as React from 'react';
import App from './App';
import './global.css'

import { createRoot } from 'react-dom/client';


import { FirebaseProvider } from "./firebase.jsx";
import { Provider } from 'react-redux';
import store from './redux/store';




const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <FirebaseProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </FirebaseProvider>
  </React.StrictMode>,
);
