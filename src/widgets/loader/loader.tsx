import React from 'react';
import cls from './styled/loader.module.scss';

interface ILoaderProps {
    isLoading: boolean;
}

const Loader = ({isLoading}:ILoaderProps) => {

    if(!isLoading) return null;

    return (
        <div className={cls.loaderWrapper}>
            <div className={cls.loader}></div>
        </div>
    );
};

export default Loader;
