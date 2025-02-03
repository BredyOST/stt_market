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



function Header(props) {

    /** STATES */
    // const [telegramUsername, setTelegramUsername] = useState('')
    const [showTelegramChangeModal, setShowTelegramChangeModal] = useState(false)
    const [telegramCode, setTelegramCode] = useState('')
    const [telegramValid, setTelegramValid] = useState(0)
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [showTelegramModal, setShowTelegramModal] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const [safetyModalShow, setSafetyModalShow] = useState(false)

    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    /** ACTIONS*/
    const {changeStateLoggedIn, addAccount, addProvider, addSttRates, addWallet, addTelegramUsername,} = authActions;
    const {closeModal, openModal} = modalAddProfileActions

    const {loggedIn, account, provider, wallet, withoutWallet, telegramUsername} = useAppSelector(state => state.authSlice)
    const {modalSafetyConnection, isClosingModalSafetyConnection} = useAppSelector(state => state.modalWindow);

    // const { open } = useWeb3Modal()
    // const { address, chainId, isConnected } = useWeb3ModalAccount();
    // const { walletProvider } = useWeb3ModalProvider();



    /** Functions*/
    /** Функция отправки сообщения о подключенных уведомления в тг*/
    async function safetyCheck(userName = null) {
        try {
            const data = {'username': telegramUsername ?? userName}
            const response = await axios.post('https://stt.market/api/notifications/safety/', data)
            if(response.status === 200) {
                // setSafetyModalShow(true)
            }
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const check = async () => {
            if (account) {
                try {
                    const data = { 'account': account };
                    const response: any = await axios.post('https://stt.market/api/notifications/check/', data);
                    if (response.status === 200) {
                        let dd = response.data;
                        dispatch(addTelegramUsername(dd.username))
                        console.log(dd.username)
                        safetyCheck(dd.username)
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        };
        check();
    }, [account])

    /** для авторизации пользователя */
    async function handleLogin() {
        try {
            // await open()
            if(props.walletKit) {
                console.log(props.walletKit);
                props?.walletKit.on('session_authenticate', async payload => {
                    console.log(payload)

                    // Process the authentication request here.
                    // Steps include:
                    // 1. Populate the authentication payload with the supported chains and methods
                    // 2. Format the authentication message using the payload and the user's account
                    // 3. Present the authentication message to the user
                    // 4. Sign the authentication message(s) to create a verifiable authentication object(s)
                    // 5. Approve the authentication request with the authentication object(s)
                })
            }

        } catch (error) {
            console.log("Error handle login", error);
        }
    }

    /** Выйти с учетной записи*/
    const handleLogout = () => {
        dispatch(changeStateLoggedIn(false))
        dispatch(addAccount(null))
    };

    /** функции для отображения попапов*/
    const showModalSafetyConnection = () => {
        if(telegramUsername) {
            safetyCheck()
        }
        const modalSendTokens:any = 'modalSafetyConnection'
        dispatch(openModal({modalName: modalSendTokens}))
    }

    return (
        <>
            {loggedIn
                ?    <div className={'cover__container'}>
                <div className={`${cls.wrapper} ${cls.additional}`}>
                    <ProfileInfo/>
                    <div className={cls.rightBlock}>
                        <div className={cls.langAndSaffety}>
                            <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language}/>
                            <CustomButton type='button' onClick={showModalSafetyConnection}><SvgSafety className={cls.svg_safety}/></CustomButton>
                        </div>
                        <CustomButton classNameBtn={cls.btnConnect} type='button'
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
                            <div className={cls.leftBlock}>
                                <Logo/>
                                <CustomButton
                                    classNameBtn={cls.btnConnectAddProfile}
                                    type='button'
                                >
                                    <div className={cls.btnConnectAddProfileText}>
                                        <SvgProfile className={cls.svgLogoProfile}/>
                                        {t('addProfile')}
                                    </div>
                                </CustomButton>
                            </div>
                            <div className={cls.rightBlock}>
                                <CustomSelect options={LANGUAGES} indicator={SelectsIndicators.language}/>
                                <CustomButton classNameBtn={cls.btnConnect} type='button'
                                              onClick={handleLogin}>{t('connect')}
                                </CustomButton>
                            </div>
                        </div>
                    </div>
                </>
            }

            {/*<div className={cls.wallet_header_telegram}>*/}
            {/*    {!props.withoutWallet*/}
            {/*        ? <>*/}
            {/*{telegramUsername !== ''*/}
            {/*    ? <>*/}
            {/*        <div className={"notifications-btn"} style={{marginRight: 20}}*/}
            {/*             onClick={safetyCheck}><i className="fa-solid fa-shield-check"*/}
            {/*                                      style={{cursor: "pointer", marginBottom: 0}}></i>*/}
            {/*        </div>*/}
            {/*        <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)}*/}
            {/*               aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"}*/}
            {/*               centered>*/}
            {/*            <Modal.Body>*/}
                            {/*                <div className={"stt_modal_header"}>*/}
                            {/*                    <div style={{width: 50}}></div>*/}
                            {/*                    <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>*/}
                            {/*                        <i className="fa-solid fa-xmark"></i>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*                <div className={"help-wrapper telegram-wrapper"}*/}
                            {/*                     style={{paddingLeft: 0, paddingRight: 0}}>*/}
                            {/*                    <i className="fa-solid fa-shield-check"*/}
                            {/*                       style={{fontSize: '3.5rem', color: '#efefef'}}></i>*/}
                            {/*                    <p style={{*/}
                            {/*                        fontSize: '1.1rem',*/}
                            {/*                        marginBottom: 20,*/}
                            {/*                        marginTop: 10*/}
                            {/*                    }}>Safe<br/>Connection Check</p>*/}
                            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety*/}
                            {/*                        notification has been sent<br/>to your connected Telegram*/}
                            {/*                        account<br/><span style={{*/}
                            {/*                            fontWeight: 700,*/}
                            {/*                            fontSize: '1rem'*/}
                            {/*                        }}>{telegramUsername}</span></p>*/}
                            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>If you*/}
                            {/*                        have not received it,<br/>we recommend that you do not<br/>perform*/}
                            {/*                        any actions on the site</p>*/}

                            {/*                    <Button className="modal-button" onClick={() => setSafetyModalShow(false)}>Ok</Button>*/}
                            {/*                </div>*/}
                            {/*            </Modal.Body>*/}
                            {/*        </Modal>*/}
                            {/*        <div className={"notifications-btn"} onClick={() => setShowTelegramChangeModal(true)}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0, color: '#47c999'}}></i></div>*/}
                            {/*        <Modal size="sm" show={showTelegramChangeModal} onHide={() => setShowTelegramChangeModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal telegram-set-modal"} centered >*/}
                            {/*            <Modal.Body>*/}
                            {/*                    <div style={{width:50}}></div>*/}
                            {/*                    <div className={"notification_header"}>NOTIFICATIONS</div>*/}
                            {/*                    <div className={"close_btn"} onClick={() => setShowTelegramChangeModal(false)}>*/}
                            {/*                        <i className="fa-solid fa-xmark"></i>*/}
                            {/*                    </div>*/}
                            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
                            {/*                    <p style={{fontSize: '.9rem'}}>Address ****{props.account.substr(props.account.length - 4)} linked to<br/>Telegram account</p>*/}

                            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.5rem', color: '#008279'}}><span style={{fontWeight: 700}}>{telegramUsername}</span></h6>*/}

                            {/*                    <Button className="modal-button"  onClick={changeTelegram}>Disable</Button>*/}
                            {/*                </div>*/}
                            {/*            </Modal.Body>*/}
                            {/*        </Modal>*/}
                            {/*    </>*/}
                            {/*    : <>*/}
                            {/*        <div className={"notifications-btn"} style={{marginRight: 0}} onClick={() => setSafetyModalShow(true)}><i className="fa-solid fa-shield-check" style={{cursor: "pointer", marginBottom: 0}}></i></div>*/}
                            {/*        <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >*/}
                            {/*            <Modal.Body>*/}
                            {/*                <div className={"stt_modal_header"}>*/}
                            {/*                    <div style={{width:50}}></div>*/}
                            {/*                    <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>*/}
                            {/*                        <i className="fa-solid fa-xmark"></i>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
                            {/*                    <i className="fa-solid fa-shield-check" style={{fontSize: '3.5rem', color: '#efefef'}}></i>*/}
                            {/*                    <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>Safe<br/>Connection Check</p>*/}
                            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety connection check function<br/>is available only when Telegram<br/>notifications are enabled</p>*/}

                            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>*/}

                            {/*                    <Button className="modal-button"  onClick={() => setSafetyModalShow(false)}>Ok</Button>*/}
                            {/*                </div>*/}
                            {/*            </Modal.Body>*/}
                            {/*        </Modal>*/}
                            {/*        <div className={"notifications-btn"} onClick={prepareTelegram}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0}}></i></div>*/}
                            {/*        <Modal size="sm" show={showTelegramModal} onHide={() => setShowTelegramModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>*/}
                            {/*            <Modal.Body style={{paddingTop: 0}}>*/}
                            {/*                <div className={"stt_modal_header"}>*/}
                            {/*                    <div style={{width:50}}></div>*/}
                            {/*                    <div className={"notification_header"}>NOTIFICATIONS</div>*/}
                            {/*                    <div className={"close_btn"} onClick={() => setShowTelegramModal(false)}>*/}
                            {/*                        <i className="fa-solid fa-xmark"></i>*/}
                            {/*                    </div>*/}

                            {/*                </div>*/}
                            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}

                            {/*                    <p style={{fontSize: '.9rem'}}>Join telegram bot via<br/>link below</p>*/}
                            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>*/}

                            {/*                    <p style={{fontSize: '.9rem', marginTop: 40}}>Send to the bot<br/>the code below</p>*/}
                            {/*                    <h3>{telegramCode}</h3>*/}
                            {/*                    <p style={{fontSize: '.85rem', fontWeight: 400, marginTop: 0}}>Code will expire in<br/><Countdown date={new Date(telegramValid * 1000)} /></p>*/}

                            {/*                    <Button className="modal-button" onClick={() => checkTelegram(true)}>I Sent</Button>*/}
                            {/*                </div>*/}
                            {/*            </Modal.Body>*/}
                            {/*        </Modal>*/}
                            {/*    </>*/}
                            {/*}*/}
                    {/*        <Toast onClose={() => setToastCompleteShow(false)} show={toastCompleteShow} onClick={() => setToastCompleteShow(false)} autohide delay={5000} className={"complete-toast"}>*/}
                    {/*            <Toast.Body>*/}
                    {/*                <i className="fa-solid fa-circle-check" style={{fontSize: '6rem', margin: 20, color: '#96fac5'}}></i>*/}
                    {/*                <p style={{fontWeight: 600}}>SUCCESS</p>*/}
                    {/*                <p className={"complete-toast-text"}>Please, refresh the page</p>*/}
                    {/*            </Toast.Body>*/}
                    {/*        </Toast>*/}
                    {/*        <Toast onClose={() => setToastErrorShow(false)} show={toastErrorShow} onClick={() => setToastErrorShow(false)} autohide delay={5000}  className={"complete-toast"}>*/}
                    {/*            <Toast.Body>*/}
                    {/*                <i className="fa-solid fa-circle-xmark" style={{fontSize: '6rem', margin: 20, color: '#ff968f'}}></i>*/}
                    {/*                <p className={"toast-err"} style={{fontWeight: 600, color: '#dc3545'}}>ERROR</p>*/}
                    {/*                <p className={"complete-toast-text"}>{toastText}</p>*/}
                    {/*            </Toast.Body>*/}
                    {/*        </Toast>*/}
                    {/*      </>*/}

                    {/*    : <></>*/}
                    {/*}*/}
                {/*</div>*/}
            {/*</div>*/}
        </>

    )
}

export default Header