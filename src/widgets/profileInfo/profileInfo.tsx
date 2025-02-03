import React from 'react';
import cls from './profile.module.scss'
import {ReactComponent as SvgCash} from "./../../assets/svg/cash.svg";
import {ReactComponent as SvgFavorites} from "./../../assets/svg/favorites.svg";
import {ReactComponent as SvgSubscribers} from "./../../assets/svg/subscribes.svg";

const ProfileInfo = () => {

    return (
        <div className={cls.wrapper}>
            <div className={cls.logo}>
                <img className={cls.svgLogo} src="/test.jpg" alt="pictures"/>
            </div>
            <div className={cls.info_user}>
                <div className={cls.name_user}>
                    <div className={cls.name}>Your Name</div>
                    <div className={cls.status}>creator</div>
                </div>
                <div className={cls.interaction_block}>
                    <div className={cls.info_block}>
                        <SvgCash className={`${cls.svgInfo} ${cls.cash}`}/>
                        <div>18</div>
                    </div>
                    <div className={cls.info_block}>
                        <SvgFavorites className={`${cls.svgInfo} ${cls.star}`}/>
                        <div>1.8M</div>
                    </div>
                    <div className={cls.info_block}>
                        <SvgSubscribers className={`${cls.svgInfo} ${cls.subsribers}`}/>
                        <div>1.8K</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;