import React from 'react';
import ReactDOM from 'react-dom/client';
import './shared/styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReduxProvider from './shared/redux/provider/reduxProvider';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './i18n';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/api/api/queryClient';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/*<ReactQueryDevtools initialIsOpen={false} />*/}

            <ReduxProvider>
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                    }}
                >
                    <App />
                </BrowserRouter>
            </ReduxProvider>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
