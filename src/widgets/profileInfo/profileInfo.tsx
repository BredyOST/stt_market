import React from 'react';
import cls from './profile.module.scss'
import {ReactComponent as SvgCash} from "./../../assets/svg/cash.svg";
import {ReactComponent as SvgFavorites} from "../../assets/svg/share.svg";
import {ReactComponent as SvgSubscribers} from "./../../assets/svg/subscribes.svg";
import Logo from "../logo/logo";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {ReactComponent as SvgProfile} from './../../assets/svg/profileLogo.svg';
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import { useAppKit } from '@reown/appkit/react'


/** заглушка  - профиль отсутствует*/
export const activeProfile = true

interface IProfileInfoProps {
    showInTheHeader: boolean;
}


const ProfileInfo = ({showInTheHeader}:IProfileInfoProps) => {


    const dispatch = useAppDispatch();

    const {t} = useTranslation();

    /** states */
    const {loggedIn } = useAppSelector(state => state.authSlice)

    /** appkit*/
    const { open  } = useAppKit()

    const { modalAddProfileState } = useAppSelector((state) => state.modalWindow);
    const { changeModalAddProfileState } = modalAddProfileActions;

    const changeStateModalWindow = () => {
        dispatch(changeModalAddProfileState(!modalAddProfileState));
    };

    /** для авторизации пользователя через кошелек*/
    async function handleLogin(): Promise<void> {
        try {
            await open()
        } catch (error) {
            console.log("Error handle login", error);
        }
    }

    if(!showInTheHeader && !activeProfile){
        return null
    }


    if(!activeProfile) {
        return (
            <div className={cls.header_left_block}>
                <Logo/>
                <CustomButton
                    classNameBtn={cls.btn_add_profile}
                    type='button'
                    onClick={changeStateModalWindow}
                >
                    <div className={cls.btn_add_profile_text}>
                        <SvgProfile className={cls.svgLogoProfile}/>
                        {t('addProfile')}
                    </div>
                </CustomButton>
                <CustomButton classNameBtn={`${cls.btn_connect} ${cls.max}`} type='button'
                              onClick={handleLogin}>{loggedIn ? t('logout') : t('connect')}
                </CustomButton>
            </div>
        )

    }

    return (
        <div className={`${showInTheHeader ? cls.wrapper_header : cls.wrapper_body}`}>
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