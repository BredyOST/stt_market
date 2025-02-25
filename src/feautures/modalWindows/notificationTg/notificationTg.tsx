import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../shared/redux/hooks/hooks';
import { modalAddProfileActions } from '../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { authActions } from '../../../shared/redux/slices/authSlice/authSlice';
import cls from './notifictionTg.module.scss';
import CustomButton from '../../../shared/ui/сustomButton/CustomButton';
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import Countdown from 'react-countdown';

const NotificationTg = () => {
    const dispatch = useDispatch();

    /** STATES*/
    const { withoutWallet, telegramUsername, telegramValid, account, telegramCode } = useAppSelector((state) => state.authSlice);
    const [toastCompleteShow, setToastCompleteShow] = useState(false);
    const [toastText, setToastText] = useState('');
    const [toastErrorShow, setToastErrorShow] = useState(false);

    /** ACTIONS*/
    const { closeModal, openModal } = modalAddProfileActions;
    const { addTelegramValid, addTelegramCode, addTelegramUsername } = authActions;

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSafetyConnection = () => {
        const modalName: any = 'modalSafetyConnection';
        dispatch(closeModal({ modalName: modalName }));
    };

    const closeModalNotifications = () => {
        const modalName: any = 'modalNotifications';
        dispatch(closeModal({ modalName: modalName }));
    };

    /** Функция отображения попапа*/
    const showModalNotifications = () => {
        const modalName: any = 'modalNotifications';
        dispatch(openModal({ modalName: modalName }));
    };

    /** проверяем подключены ли телеграмм уведомления*/
    async function checkTelegram(requested) {
        try {
            const data = { account: account };
            const response = await axios.post('https://stt.market/api/notifications/check/', data);
            if (response.status === 200) {
                let dd = response.data;
                console.log(dd);
                dispatch(addTelegramUsername(dd.username));
                if (requested) {
                    if (dd.username !== '') {
                        closeModalSafetyConnection();
                        setToastCompleteShow(true);
                    } else {
                        setToastText('Are you sure you have sent the code?');
                        setToastErrorShow(true);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function changeTelegram() {
        try {
            const data = { account: account };
            const response = await axios.post('https://stt.market/api/notifications/change/', data);
            if (response.status === 200) {
                let dd = response.data;
                console.log('third')
                console.log(dd)
                if (dd.status === 400) {
                    setToastText(dd.message);
                    setToastErrorShow(true);
                } else if (dd.status === 200) {
                    dispatch(addTelegramUsername(''));
                    // setTelegramUsername('')
                    closeModalSafetyConnection();
                    prepareTelegram();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function prepareTelegram() {
        try {
            const data = { account: account };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            if (response.status === 200) {
                let dd = response.data;
                if (dd.status === 400) {
                    setToastText(dd.message);
                    setToastErrorShow(true);
                } else if (dd.status === 200) {
                    console.log(dd);
                    dispatch(addTelegramValid(dd.valid));
                    dispatch(addTelegramCode(dd.code));
                    showModalNotifications();
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className={cls.wallet_header_telegram}>
                <div className={cls.wrapper}>
                    <div className={cls.stt_modal_header}>
                        {!withoutWallet && telegramUsername !== '' ? (
                            <>
                                <div className={cls.notification_header}>NOTIFICATIONS</div>
                                <CustomButton
                                    onClick={closeModalNotifications}
                                    classnameWrapper={cls.wrapper_btn}
                                    classNameBtn={cls.cover_btn}
                                    type='button'
                                >
                                    <SvgClose className={cls.close_svg} />
                                </CustomButton>
                                <div className={cls.cover_head}>
                                    <div>
                                        {' '}
                                        Address ****{account?.substr(account?.length - 4)} linked to
                                        <br />
                                        Telegram account
                                    </div>
                                </div>
                                <div className={cls.cover_body_userName}>
                                    <div>{telegramUsername}</div>
                                </div>
                                <div className={cls.cover_footer}></div>
                                <CustomButton onClick={changeTelegram} classNameBtn={cls.btn} type='button'>
                                    Disable
                                </CustomButton>
                            </>
                        ) : (
                            <>
                                <div className={cls.notification_header}>NOTIFICATIONS</div>
                                <div className={cls.cover}>
                                    <CustomButton
                                        onClick={closeModalNotifications}
                                        classnameWrapper={cls.wrapper_btn}
                                        classNameBtn={cls.cover_btn}
                                        type='button'
                                    >
                                        <SvgClose className={cls.close_svg} />
                                    </CustomButton>
                                    <div className={cls.cover_head}>
                                        <div> Join telegram bot via</div>
                                        <div> link below</div>
                                    </div>
                                    <div className={cls.linkCover}>
                                        <a href={'https://t.me/stt_info_bot'} target='_blank' rel='noopener noreferrer'>
                                            @stt_info_bot
                                        </a>
                                    </div>
                                    <div className={cls.cover_body}>
                                        <div> Send to the bot</div>
                                        <div> the code below</div>
                                        <div className={cls.code}>{telegramCode}</div>
                                    </div>
                                    <div className={cls.cover_footer}>
                                        <div>Code will expire in</div>
                                        <Countdown date={new Date(telegramValid * 1000)} />
                                    </div>
                                    <CustomButton onClick={() => checkTelegram(true)} classNameBtn={cls.btn} type='button'>
                                        {' '}
                                        I Sent
                                    </CustomButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/*<Toast onClose={() => setToastCompleteShow(false)} show={toastCompleteShow}*/}
            {/*       onClick={() => setToastCompleteShow(false)} autohide delay={5000} className={"complete-toast"}>*/}
            {/*    <Toast.Body>*/}
            {/*        <i className="fa-solid fa-circle-check"*/}
            {/*           style={{fontSize: '6rem', margin: 20, color: '#96fac5'}}></i>*/}
            {/*        <p style={{fontWeight: 600}}>SUCCESS</p>*/}
            {/*        <p className={"complete-toast-text"}>Please, refresh the page</p>*/}
            {/*    </Toast.Body>*/}
            {/*</Toast>*/}
            {/*<Toast onClose={() => setToastErrorShow(false)} show={toastErrorShow}*/}
            {/*       onClick={() => setToastErrorShow(false)} autohide delay={5000} className={"complete-toast"}>*/}
            {/*    <Toast.Body>*/}
            {/*        <i className="fa-solid fa-circle-xmark"*/}
            {/*           style={{fontSize: '6rem', margin: 20, color: '#ff968f'}}></i>*/}
            {/*        <p className={"toast-err"} style={{fontWeight: 600, color: '#dc3545'}}>ERROR</p>*/}
            {/*        <p className={"complete-toast-text"}>{toastText}</p>*/}
            {/*    </Toast.Body>*/}
            {/*</Toast>*/}
        </>
    );
};

export default NotificationTg;
