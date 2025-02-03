import React, {useState} from 'react';
import {Toast} from "react-bootstrap";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import cls from './safetyConnection.module.scss'

const SafetyConnection = () => {

    const dispatch = useAppDispatch()

    /** STATES*/
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const {withoutWallet, telegramUsername} = useAppSelector(state => state.authSlice)
    const {modalTelegram, isClosingModalTelegram} = useAppSelector(state => state.modalWindow);


    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions

    /**Functions*/

    /** для закрытия модального окна*/
    const closeModalSafetyConnection = () => {
        const modalSendTokens:any = 'modalSafetyConnection'
        dispatch(closeModal({modalName: modalSendTokens}))
    }

    return (
        <>
            <div className={cls.wallet_header_telegram}>
                <div className={cls.wrapper}>
                    <div className={cls.stt_modal_header}>
                        {!withoutWallet && telegramUsername !== ''
                            ? <>
                                <div className={cls.notification_header}>SAFETY</div>
                                <CustomButton onClick={closeModalSafetyConnection} classnameWrapper={cls.wrapper_btn}
                                              classNameBtn={cls.cover_btn} type='button'>
                                    <SvgClose className={cls.close_svg}/>
                                </CustomButton>
                                <div className={cls.cover_head}>
                                    <div>Safe</div>
                                    <div>Connection Check</div>
                                </div>
                                <div className={cls.cover_body}>
                                    <div>Safety notification has been sent</div>
                                    <div>to your connected Telegram account</div>
                                    <div className={cls.userName}>{telegramUsername}</div>
                                    <div>If you have not received it, we recommend that you do not perform
                                        any actions on the site
                                    </div>
                                </div>
                                <CustomButton onClick={closeModalSafetyConnection} classNameBtn={cls.btn}
                                              type='button'>
                                    ok
                                </CustomButton>
                            </>
                            : <>
                                <div className={cls.notification_header}>SAFETY</div>
                                <div className={cls.cover}>
                                <CustomButton onClick={closeModalSafetyConnection} classnameWrapper={cls.wrapper_btn}
                                              classNameBtn={cls.cover_btn} type='button'>
                                    <SvgClose className={cls.close_svg}/>
                                </CustomButton>
                                <div className={cls.cover_head}>
                                    <div>Safe</div>
                                    <div>Connection Check</div>
                                </div>
                                <div className={cls.cover_body}>
                                    <div>Safety connection check function</div>
                                    <div>is available only when Telegram</div>
                                    <div>notifications are enabled</div>
                                </div>
                                <div className={cls.cover_footer}>
                                    <div>@stt_info_bot</div>
                                </div>
                                <CustomButton onClick={closeModalSafetyConnection} classNameBtn={cls.btn}
                                              type='button'>ok</CustomButton>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <Toast onClose={() => setToastCompleteShow(false)} show={toastCompleteShow}
                       onClick={() => setToastCompleteShow(false)} autohide delay={5000} className={"complete-toast"}>
                    <Toast.Body>
                        <i className="fa-solid fa-circle-check"
                           style={{fontSize: '6rem', margin: 20, color: '#96fac5'}}></i>
                        <p style={{fontWeight: 600}}>SUCCESS</p>
                        <p className={"complete-toast-text"}>Please, refresh the page</p>
                    </Toast.Body>
                </Toast>
                <Toast onClose={() => setToastErrorShow(false)} show={toastErrorShow}
                       onClick={() => setToastErrorShow(false)} autohide delay={5000} className={"complete-toast"}>
                    <Toast.Body>
                        <i className="fa-solid fa-circle-xmark" style={{fontSize: '6rem', margin: 20, color: '#ff968f'}}></i>
                        <p className={"toast-err"} style={{fontWeight: 600, color: '#dc3545'}}>ERROR</p>
                        <p className={"complete-toast-text"}>{toastText}</p>
                    </Toast.Body>
                </Toast>
            </div>
        </>
            );
            };

            export default SafetyConnection;