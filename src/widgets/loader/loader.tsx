import React from 'react';
import cls from './styled/loader.module.scss';

const Loader = () => {
    return (
        <div className={cls.loaderWrapper}>
            <div className={cls.loader}></div>
        </div>
    );
};

export default Loader;
