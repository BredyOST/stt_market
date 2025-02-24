import React from 'react';
import cls from './styled/loader.module.scss';
import { useAppSelector } from '../../shared/redux/hooks/hooks';

interface ILoaderProps {
    isLoading: boolean;
}

const Loader = ({ isLoading }: ILoaderProps) => {
    const { textInfo } = useAppSelector((state) => state.authSlice);

    if (!isLoading) return null;

    return (
        <div className={`${cls.loaderWrapper} ${textInfo && cls.backgraund}`}>
            <div className={cls.loader}></div>
            <div className={cls.loadingText}>{textInfo}</div>
        </div>
    );
};

export default Loader;
