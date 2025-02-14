import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/index.scss'
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReduxProvider from "./shared/redux/provider/reduxProvider";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import './i18n'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
    <ReduxProvider>
      <BrowserRouter>
        <App />
     <ToastContainer />
      </BrowserRouter>
    </ReduxProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
