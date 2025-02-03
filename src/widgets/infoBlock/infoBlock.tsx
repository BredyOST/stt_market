import React from 'react';
import Wallet from "../wallet/wallet";
import ChartBlock from "../chart/chart";
import cls from './infoBlock.module.scss'
import SttBonus from "../sttBonus/sttBonus";


const AuthorizedUser = () => {

        return (
            <div className={`cover__container`}>
                <div className={cls.grid_wrapper}>
                    <Wallet/>
                    <ChartBlock/>
                    <SttBonus/>
                </div>
            </div>
        );
};

export default AuthorizedUser;