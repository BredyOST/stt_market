import React from 'react';
import cls from './styled/sttBonus.module.scss'
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import Portal from "../../shared/ui/portal/portal";
import Modal from "../../shared/ui/modal/modal";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import NotificationTg from "../../feautures/modalWindows/notificationTg/notificationTg";
import axios from "axios";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {ForFunc} from "../../entities/others";
import SttBonusWindow from "../../feautures/modalWindows/sttBonus/sttBonus";


interface ISttBonus {
    visibility: boolean
}

const SttBonus = ({visibility}: ISttBonus) => {

    const dispatch = useAppDispatch();

    /** states*/
    const {loggedIn, account } = useAppSelector(state => state.authSlice);
    const {modalNotifications, isClosingModalNotifications, modalSttBonus, isClosingSttBonus} = useAppSelector(state => state.modalWindow)

    /** actions*/
    const {openModal} = modalAddProfileActions
    const {addTelegramCode, addTelegramValid} = authActions;

    /** Functions*/
    /** Функция отображения попапа уведомлений*/
    const showModalNotifications:ForFunc<void, void> = () => {
        const modalName:string = 'modalNotifications'
        dispatch(openModal({modalName: modalName as keyof IModalWindowStatesSchema}))
    }
    /** Функция отображения попапа stt bonus*/
    const showModalSttBonus:ForFunc<void, void> = () => {
        const modalSttBonus:any = 'modalSttBonus'
        dispatch(openModal({modalName: modalSttBonus as keyof IModalWindowStatesSchema}))
    }

    /** Функция проверки телеграмма*/
    async function prepareTelegram():Promise<void> {
        try {
            const data:{account: string} = {'account': account}
            const response = await axios.post('https://stt.market/api/notifications/create/', data)
            if(response.status === 200) {
                let dd = response.data
                if (dd.status === 400) {
                    showModalNotifications()
                } else if (dd.status === 200) {
                    dispatch(addTelegramValid(dd.valid))
                    dispatch(addTelegramCode(dd.code))
                    showModalNotifications()
                }
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className={`${visibility ? cls.wrapper_big : cls.wrapper_compact}`}>
            <div className={cls.cover_block}>
                <CustomButton onClick={showModalSttBonus} classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big : cls.cover_btn_compact}`} classNameBtn={cls.btn_stt_bonus} type='button'>
                    <div className={visibility ? cls.btn_stt_text : cls.btn_stt_text_compact}>
                        <img src={visibility ? "/img/giftStt.svg" : "/img/giftCompact.jpg"} alt="pictures"/>
                        <div>STT bonus</div>
                    </div>
                </CustomButton>
            </div>
            <div className={cls.cover_block}>
                <CustomButton onClick={prepareTelegram}  classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big_other : cls.cover_btn_compact_other}`} classNameBtn={cls.btn_stt_bonus} type='button'>
                    <img src={visibility ? "/img/notificationsStt.svg" : "/img/notificationsCompact.jpg" } alt="pictures"/>
                </CustomButton>
                <CustomButton classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big_other : cls.cover_btn_compact_other}`} classNameBtn={cls.btn_stt_bonus} type='button'>
                    <img src={visibility ? "/img/sentStt.png" : "/img/sendCompact.jpg"} alt="pictures"/>
                </CustomButton>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalNotifications} closing={isClosingModalNotifications}>
                    <NotificationTg/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSttBonus} closing={isClosingSttBonus}>
                    <SttBonusWindow/>
                </Modal>
            </Portal>

        </div>
    );
};

export default SttBonus;