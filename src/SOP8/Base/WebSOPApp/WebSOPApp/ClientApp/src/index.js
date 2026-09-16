import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './Root/app';
import registerServiceWorker from './registerServiceWorker';
import GlobalStyles from './Root/styled/globalStyles';
import { ThemeProvider } from "styled-components";
import theme from './Root/styled/theme';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  rootElement);

registerServiceWorker();

