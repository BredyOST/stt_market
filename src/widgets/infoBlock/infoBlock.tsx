import React from 'react';
import Wallet from '../wallet/wallet';
import ChartBlock from '../chart/chart';
import cls from './infoBlock.module.scss';
import ProfileInfo from '../profileInfo/profileInfo';

const AuthorizedUser = () => {
    return (
        <div className={`cover__container`}>
            <div className={cls.grid_wrapper_desctop}>
                <ProfileInfo className={cls.profile} showInTheHeader={true} />
                <Wallet className={cls.wallet} />
                <ChartBlock className={cls.chart} />
            </div>
        </div>
    );
};

export default AuthorizedUser;
