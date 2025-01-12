import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";

const NotificationTelegram = () => {

    const [safetyModalShow, setSafetyModalShow] = useState(false)

    return (
        <>
            <div className={"notifications-btn"} style={{marginRight: 0}}
                 onClick={() => setSafetyModalShow(true)}><i className="fa-solid fa-shield-check"
                                                             style={{cursor: "pointer", marginBottom: 0}}></i>
            </div>
            <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)}
                   aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>
                <Modal.Body>
                    <div className={"stt_modal_header"}>
                        <div style={{width: 50}}></div>
                        <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                        <i className="fa-solid fa-shield-check"
                           style={{fontSize: '3.5rem', color: '#efefef'}}></i>
                        <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>Safe<br/>Connection
                            Check</p>
                        <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety connection check
                            function<br/>is available only when Telegram<br/>notifications are enabled</p>

                        <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a
                            href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer"
                            style={{color: '#008279', textDecoration: "none"}}><span
                            style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>

                        <Button className="modal-button" onClick={() => setSafetyModalShow(false)}>Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NotificationTelegram;