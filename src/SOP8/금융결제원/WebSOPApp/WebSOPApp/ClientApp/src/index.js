import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './Root/app';
import store from './Root/store';
import registerServiceWorker from './registerServiceWorker';
import GlobalStyles from './Root/styled/globalStyles';
import { ThemeProvider } from "styled-components";
import theme from './Root/styled/theme';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>  {/* Redux Provider */}
    <BrowserRouter basename={baseUrl}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  rootElement);

registerServiceWorker();

