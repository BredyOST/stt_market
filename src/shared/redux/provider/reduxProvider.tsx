'use client';
import React from 'react';

import { Provider } from 'react-redux';
import { store } from '../config/store';

interface IReduxProviderProps {
    children: React.ReactNode;
}

const ReduxProvider = ({ children }: IReduxProviderProps) => {
    return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
