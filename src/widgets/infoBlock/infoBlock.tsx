import React from 'react';
import Wallet from "../wallet/wallet";
import ChartBlock from "../chart/chart";
import cls from './infoBlock.module.scss'
import SttBonus from "../sttBonus/sttBonus";
import ProfileInfo from "../profileInfo/profileInfo";


const AuthorizedUser = () => {

    return (
        <div className={`cover__container`}>
            <ProfileInfo showInTheHeader={false}/>
            <div className={cls.grid_wrapper_desctop}>
                <Wallet/>
                <ChartBlock visibility={true}/>
                <SttBonus visibility={true}/>
                <div className={cls.block}>
                    <ChartBlock visibility={false}/>
                    <SttBonus visibility={false}/>
                </div>
            </div>
            <div className={cls.grid_wrapper_tablet}>
                <div className={cls.grid_wrapper_tablet_cover}>
                    <div className={cls.grid_wrapper_tablet_container}>
                        <Wallet/>
                        <ChartBlock visibility={true}/>
                    </div>
                    <SttBonus visibility={false}/>
                </div>
            </div>
        </div>
    );
};

export default AuthorizedUser;