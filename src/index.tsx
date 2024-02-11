import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/CSS/index.css'
import {store} from './store';
import {Provider} from 'react-redux';
import {ChakraProvider} from '@chakra-ui/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
