import React, {useEffect, useState} from "react";
import axios from "axios";
import CustomSelect from "../../shared/ui/customSelect/customSelect";
import {LANGUAGES} from "../../entities/languages/languages";
import {SelectsIndicators} from "../../entities/uiInterfaces/uiInterfaces";
import cls from './header.module.scss'
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import SafetyConnection from "../../feautures/modalWindows/safetyConnection/safetyConnection";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import ProfileInfo from "../profileInfo/profileInfo";
import Portal from "../../shared/ui/portal/portal";
import Modal from "../../shared/ui/modal/modal";
import {ReactComponent as SvgSafety} from './../../assets/svg/safety.svg';
import {ReactComponent as SvgProfile} from './../../assets/svg/profileLogo.svg';
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import Logo from "../logo/logo";
import { useAppKit } from '@reown/appkit/react'
import {ForFunc} from "../../entities/others";
import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";


function Header() {

    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    /** states */
    const {loggedIn, account, provider, wallet, withoutWallet, telegramUsername} = useAppSelector(state => state.authSlice)
    const {modalSafetyConnection, isClosingModalSafetyConnection} = useAppSelector(state => state.modalWindow);

    /** actions*/
    const {changeStateLoggedIn, addAccount, addProvider, addSttRates, addWallet, addTelegramUsername,} = authActions;
    const {closeModal, openModal} = modalAddProfileActions

    /** appkit*/
    const { open, close } = useAppKit()

    /** Functions*/
    /** Функция отправки сообщения в тг если подключены уведомления*/
    async function safetyCheck(userName: null | string = null): Promise<void> {
        try {
            const data = {'username': telegramUsername ?? userName}
            const response = await axios.post('https://stt.market/api/notifications/safety/', data)
        } catch(err) {
            console.log(err);
        }
    }

    /** при входе в аккаунт проверяем подключние уведомлений*/
    async function check(): Promise<void> {
        try {
            const data = { 'account': account };
            const response: any = await axios.post('https://stt.market/api/notifications/check/', data);
            if (response.status === 200) {
                let dd = response.data;
                dispatch(addTelegramUsername(dd.username))
                safetyCheck(dd.username)
            }
        } catch (err) {
            console.log(err);
        }
    }

    /** для авторизации пользователя через кошелек*/
    async function handleLogin(): Promise<void> {
        try {
            await open()
        } catch (error) {
            console.log("Error handle login", error);
        }
    }

    /** Выйти с учетной записи*/
    const handleLogout:ForFunc<void, void> = () => {
        close()
        dispatch(changeStateLoggedIn(false))
        dispatch(addAccount(null))
    };

    /** функции для отображения попапов*/
    const showModalSafetyConnection:ForFunc<void, void> = () => {
        if(telegramUsername) {
            safetyCheck()
        }
        const modalSendTokens:string = 'modalSafetyConnection'
        dispatch(openModal({modalName: modalSendTokens as keyof IModalWindowStatesSchema}))
    }

    useEffect(() => {
        if (account) check();
    }, [account])


    return (
        <>
            {loggedIn
                ?<div className={'cover__container'}>
                    <div className={`${cls.wrapper} ${cls.additional}`}>
                        <ProfileInfo/>
                        <div className={cls.header_right_block}>
                            <div className={cls.language_safety}>
                                <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language}/>
                                <CustomButton type='button' onClick={showModalSafetyConnection}><SvgSafety className={cls.svg_safety}/></CustomButton>
                            </div>
                            <CustomButton classNameBtn={cls.btn_connect} type='button'
                                          onClick={handleLogin}>{t('connect')}</CustomButton>
                        </div>
                        <Portal whereToAdd={document.body}>
                            <Modal show={modalSafetyConnection} closing={isClosingModalSafetyConnection}>
                                <SafetyConnection/>
                            </Modal>
                        </Portal>
                    </div>
                </div>
                : <>
                    <div className={'big__container-big'}>
                        <div className={cls.wrapper}>
                            <div className={cls.header_left_block}>
                                <Logo/>
                                <CustomButton
                                    classNameBtn={cls.btn_add_profile}
                                    type='button'
                                >
                                    <div className={cls.btn_add_profile_text}>
                                        <SvgProfile className={cls.svgLogoProfile}/>
                                        {t('addProfile')}
                                    </div>
                                </CustomButton>
                            </div>
                            <div className={cls.header_right_block}>
                                <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language}/>
                                <CustomButton classNameBtn={cls.btn_connect} type='button'
                                              onClick={handleLogin}>{t('connect')}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Header