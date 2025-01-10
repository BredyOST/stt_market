import React, {useEffect, useState} from "react";
import './header.css'
import {Button, Modal, Toast} from "react-bootstrap";
import Countdown from "react-countdown";
import axios from "axios";
import CustomSelect from "../../shared/ui/customSelect/customSelect";
import {LANGUAGES} from "../../entities/languages/languages";
import {SelectsIndicators} from "../../entities/uiInterfaces/uiInterfaces";
import  {ReactComponent as SvgLogo} from "./../../assets/svg/stt-logo.svg";
import cls from './header.module.scss';
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../shared/redux/hooks/hooks";

function Header(props) {

    /** states */
    const [telegramUsername, setTelegramUsername] = useState('')
    const [showTelegramChangeModal, setShowTelegramChangeModal] = useState(false)
    const [telegramCode, setTelegramCode] = useState('')
    const [telegramValid, setTelegramValid] = useState(0)
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [showTelegramModal, setShowTelegramModal] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const [safetyModalShow, setSafetyModalShow] = useState(false)

    const {loggedIn, account } = useAppSelector(state => state.authSlice)

    // console.log(`accReduxL ${account}`)
    // console.log(props.account)
    async function prepareTelegram() {
        const data = {'account': props.account}
        axios.post('https://stt.market/api/notifications/create/', data)
            .then((response) => {
                let dd = response.data
                if (dd.status === 400) {
                    setToastText(dd.message)
                    setToastErrorShow(true)

                } else if (dd.status === 200) {
                    setTelegramValid(dd.valid)
                    setTelegramCode(dd.code)
                    setShowTelegramModal(true)
                }

            })
            .catch(function (error) {
                console.log(error);
            });

    }

    function changeTelegram() {
        const data = {'account': props.account}
        axios.post('https://stt.market/api/notifications/change/', data)
            .then((response) => {
                let dd = response.data
                if (dd.status === 400) {
                    setToastText(dd.message)
                    setToastErrorShow(true)
                } else if (dd.status === 200) {
                    setTelegramUsername('')
                    setShowTelegramChangeModal(false)
                    prepareTelegram()
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function checkTelegram(requested=false) {
        const data = {'account': props.account}
        axios.post('https://stt.market/api/notifications/check/', data)
            .then((response) => {
                let dd = response.data
                setTelegramUsername(dd.username)
                if (requested) {
                    if (dd.username !== '') {
                        setShowTelegramModal(false)
                        setToastCompleteShow(true)
                    } else {
                        setToastText('Are you sure you have sent the code?')
                        setToastErrorShow(true)
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function safetyCheck() {
        const data = {'username': telegramUsername}
        axios.post('https://stt.market/api/notifications/safety/', data)
            .then((response) => {
                setSafetyModalShow(true)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        if (props.account) {
            const data = {'account': props.account}
            axios.post('https://stt.market/api/notifications/check/', data)
                .then((response) => {
                    let dd = response.data
                    setTelegramUsername(dd.username)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [])



    const {t} = useTranslation();

    return (
        <>
            <div className={"wallet__header eth-card"}>
                <div className={cls.wallet_header_logo}>
                    <SvgLogo className={cls.svgLogo} />
                    <p className={cls.labelLogo}>{t("Smart Trading Token")}</p>
                </div>
                <div className={"wallet__header-telegram"}>
                    <CustomSelect  options={LANGUAGES} indicator={SelectsIndicators.language}/>
                    {!props.withoutWallet
                        ? <>
                            {telegramUsername !== ''
                                ? <>
                                    <div className={"notifications-btn"} style={{marginRight: 20}} onClick={safetyCheck}><i className="fa-solid fa-shield-check" style={{cursor: "pointer", marginBottom: 0}}></i></div>
                                    <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >
                                        <Modal.Body>
                                            <div className={"stt_modal_header"}>
                                                <div style={{width:50}}></div>
                                                <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </div>
                                            </div>
                                            <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                                                <i className="fa-solid fa-shield-check" style={{fontSize: '3.5rem', color: '#efefef'}}></i>
                                                <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>Safe<br/>Connection Check</p>
                                                <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety notification has been sent<br/>to your connected Telegram account<br/><span style={{fontWeight: 700, fontSize: '1rem'}}>{telegramUsername}</span></p>
                                                <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>If you have not received it,<br/>we recommend that you do not<br/>perform any actions on the site</p>

                                                <Button className="modal-button"  onClick={() => setSafetyModalShow(false)}>Ok</Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    <div className={"notifications-btn"} onClick={() => setShowTelegramChangeModal(true)}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0, color: '#47c999'}}></i></div>
                                    <Modal size="sm" show={showTelegramChangeModal} onHide={() => setShowTelegramChangeModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal telegram-set-modal"} centered >
                                        <Modal.Body>
                                                <div style={{width:50}}></div>
                                                <div className={"notification_header"}>NOTIFICATIONS</div>
                                                <div className={"close_btn"} onClick={() => setShowTelegramChangeModal(false)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </div>
                                            <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                                                <p style={{fontSize: '.9rem'}}>Address ****{props.account.substr(props.account.length - 4)} linked to<br/>Telegram account</p>

                                                <h6 style={{marginBottom: 40, fontSize: '1.5rem', color: '#008279'}}><span style={{fontWeight: 700}}>{telegramUsername}</span></h6>

                                                <Button className="modal-button"  onClick={changeTelegram}>Disable</Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </>
                                : <>
                                    <div className={"notifications-btn"} style={{marginRight: 0}} onClick={() => setSafetyModalShow(true)}><i className="fa-solid fa-shield-check" style={{cursor: "pointer", marginBottom: 0}}></i></div>
                                    <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >
                                        <Modal.Body>
                                            <div className={"stt_modal_header"}>
                                                <div style={{width:50}}></div>
                                                <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </div>

                                            </div>
                                            <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                                                <i className="fa-solid fa-shield-check" style={{fontSize: '3.5rem', color: '#efefef'}}></i>
                                                <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>Safe<br/>Connection Check</p>
                                                <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety connection check function<br/>is available only when Telegram<br/>notifications are enabled</p>

                                                <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>

                                                <Button className="modal-button"  onClick={() => setSafetyModalShow(false)}>Ok</Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                    <div className={"notifications-btn"} onClick={prepareTelegram}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0}}></i></div>
                                    <Modal size="sm" show={showTelegramModal} onHide={() => setShowTelegramModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>

                                        <Modal.Body style={{paddingTop: 0}}>
                                            <div className={"stt_modal_header"}>
                                                <div style={{width:50}}></div>
                                                <div className={"notification_header"}>NOTIFICATIONS</div>
                                                <div className={"close_btn"} onClick={() => setShowTelegramModal(false)}>
                                                    <i className="fa-solid fa-xmark"></i>
                                                </div>

                                            </div>
                                            <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>

                                                <p style={{fontSize: '.9rem'}}>Join telegram bot via<br/>link below</p>
                                                <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>

                                                <p style={{fontSize: '.9rem', marginTop: 40}}>Send to the bot<br/>the code below</p>
                                                <h3>{telegramCode}</h3>
                                                <p style={{fontSize: '.85rem', fontWeight: 400, marginTop: 0}}>Code will expire in<br/><Countdown date={new Date(telegramValid * 1000)} /></p>

                                                <Button className="modal-button" onClick={() => checkTelegram(true)}>I Sent</Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            }
                            <Toast onClose={() => setToastCompleteShow(false)} show={toastCompleteShow} onClick={() => setToastCompleteShow(false)} autohide delay={5000} className={"complete-toast"}>
                                <Toast.Body>
                                    <i className="fa-solid fa-circle-check" style={{fontSize: '6rem', margin: 20, color: '#96fac5'}}></i>
                                    <p style={{fontWeight: 600}}>SUCCESS</p>
                                    <p className={"complete-toast-text"}>Please, refresh the page</p>
                                </Toast.Body>
                            </Toast>
                            <Toast onClose={() => setToastErrorShow(false)} show={toastErrorShow} onClick={() => setToastErrorShow(false)} autohide delay={5000}  className={"complete-toast"}>
                                <Toast.Body>
                                    <i className="fa-solid fa-circle-xmark" style={{fontSize: '6rem', margin: 20, color: '#ff968f'}}></i>
                                    <p className={"toast-err"} style={{fontWeight: 600, color: '#dc3545'}}>ERROR</p>
                                    <p className={"complete-toast-text"}>{toastText}</p>
                                </Toast.Body>
                            </Toast>
                          </>
                        : <></>
                    }
                </div>
            </div>
        </>
    )
}

export default Header