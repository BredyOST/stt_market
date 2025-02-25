import React, { useEffect } from 'react';
import axios from 'axios';
import CustomSelect from '../../shared/ui/customSelect/customSelect';
import { LANGUAGES } from '../../entities/languages/languages';
import { SelectsIndicators } from '../../entities/uiInterfaces/uiInterfaces';
import cls from './header.module.scss';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import { ReactComponent as SvgSafety } from '../../assets/svg/safety.svg';
import { ReactComponent as SvgNotifications } from '../../assets/svg/notifications.svg';
import Logo from '../../widgets/logo/logo';
import { useAppKit } from '@reown/appkit/react';
import { ForFunc } from '../../entities/others';
import { useAuthState, useModal } from '../../shared/helpers/hooks';
import { loginThunk } from '../../shared/api/request/loginThunk/loginThunk';
import NotificationTg from "../modalWindows/notificationTg/notificationTg";
import SafetyConnection from "../modalWindows/safetyConnection/safetyConnection";

function Header() {
    const dispatch = useAppDispatch();

    /** STATES */
    const { loggedIn, account, telegramUsername, wallet } = useAppSelector((state) => state.authSlice);
    const { modalSafetyConnection, isClosingModalSafetyConnection, modalNotifications, isClosingModalNotifications } = useAppSelector(
        (state) => state.modalWindow
    );
    const { userInfo } = useAppSelector((state) => state.usersInfo);

    /** HOOKS*/
    const { t } = useTranslation();
    /** изменение состояний authSlice*/
    const updateAuthState = useAuthState();
    /** управление модальными окнами*/
    const { openModal } = useModal();
    /** вход в кошельки */
    const { open } = useAppKit();

    /** FUNCTIONS*/
    /** проверка подключения уведомлений и отправка сообщения в тг о входе в аккаунт*/
    async function checkNotifications(): Promise<void> {
        try {
            const data: { account: string } = { account: account };
            const response: any = await axios.post('https://stt.market/api/notifications/check/', data);
            if (response.status === 200) {
                let responseData = response.data;
                updateAuthState('telegramUsername', responseData?.username);
                // отправляем уведомления
                const data: { username: string } = { username: responseData.username };
                const res = await axios.post('https://stt.market/api/notifications/safety/', data);
            }
        } catch (err) {
            console.error('Error checking notifications:', err);
        }
    }

    React.useEffect(() => {
        if (account) {
            dispatch(loginThunk(account));
        }
    }, [account]);

    /** авторизация через кошелек*/
    async function connectAccount(): Promise<void> {
        try {
            await open();
        } catch (error) {
            console.log('Error handle loginThunk', error);
        }
    }

    /** открытие попапа уведомлений*/
    const openModalSafetyConnection: ForFunc<void, void> = () => {
        if (telegramUsername) {
            checkNotifications();
        }
        openModal('modalSafetyConnection');
    };

    /** Функция проверки телеграмма*/
    async function prepareTelegram(): Promise<void> {
        try {
            const data: { account: string } = { account: account };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            if (response.status === 200) {
                let responseData = response.data;
                console.log('second')
                console.log(responseData);
                if (responseData.status === 400) {
                    openModal('modalNotifications');
                } else if (responseData.status === 200) {
                    console.log(response);

                    updateAuthState('telegramUsername', responseData.valid);
                    updateAuthState('telegramCode', responseData.code);
                    openModal('modalNotifications');
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (account) checkNotifications();
    }, [account]);

    return (
        <>
            {loggedIn ? (
                <div className={'cover__container'}>
                    <div className={`${cls.wrapper_ath} ${userInfo?.profile?.id ? cls.active : cls.additional}`}>
                        <div className={cls.left_block}>
                            <Logo />
                                <CustomButton
                                    classNameBtn={cls.btn_connect_loggin_mobile}
                                    type='button'
                                    onClick={connectAccount}
                                >
                                    {loggedIn ? t('logout') : t('connect')}
                                </CustomButton>
                        </div>
                        <div className={cls.header_right_block}>
                            <div className={cls.language_safety}>
                                <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language} />
                                <CustomButton classNameBtn={cls.btn_stt} type='button' onClick={openModalSafetyConnection}>
                                    <SvgSafety className={cls.btn_svg_safety} />
                                </CustomButton>
                                <CustomButton onClick={prepareTelegram} classNameBtn={cls.btn_stt} type='button'>
                                    <SvgNotifications className={cls.btn_svg_notifications} />
                                </CustomButton>
                            </div>
                            <CustomButton classNameBtn={cls.btn_connect_loggin} type='button' onClick={connectAccount}>
                                {loggedIn ? t('logout') : t('connect')}
                            </CustomButton>
                        </div>
                        <Portal whereToAdd={document.body}>
                            <Modal show={modalSafetyConnection} closing={isClosingModalSafetyConnection}>
                                <SafetyConnection />
                            </Modal>
                        </Portal>
                        <Portal whereToAdd={document.body}>
                            <Modal show={modalNotifications} closing={isClosingModalNotifications}>
                                <NotificationTg />
                            </Modal>
                        </Portal>
                    </div>
                </div>
            ) : (
                <>
                    <div className={'big__container-big'}>
                        <div className={cls.wrapper}>
                            <div className={cls.header_left_block}>
                                <Logo />
                                <CustomButton classNameBtn={`${cls.btn_connect} ${cls.min}`} type='button' onClick={connectAccount}>
                                    {loggedIn ? t('logout') : t('connect')}
                                </CustomButton>
                            </div>
                            <div className={`${!loggedIn ? cls.header_right_block_no_auth : cls.header_right_block}`}>
                                <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language} />
                                <CustomButton classNameBtn={`${cls.btn_connect} ${cls.max}`} type='button' onClick={connectAccount}>
                                    {loggedIn ? t('logout') : t('connect')}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Header;
