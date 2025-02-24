import React from 'react';
import cls from './styled/sttBonus.module.scss';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import NotificationTg from '../../feautures/modalWindows/notificationTg/notificationTg';
import axios from 'axios';
import { authActions } from '../../shared/redux/slices/authSlice/authSlice';
import { ForFunc } from '../../entities/others';
import SttBonusWindow from '../../feautures/modalWindows/sttBonus/sttBonus';
import { useModal } from '../../shared/helpers/hooks';

interface ISttBonus {
    visibility: boolean;
}

const SttBonus = ({ visibility }: ISttBonus) => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { account } = useAppSelector((state) => state.authSlice);
    const { modalNotifications, isClosingModalNotifications, modalSttBonus, isClosingSttBonus } = useAppSelector(
        (state) => state.modalWindow
    );

    /** ACTIONS*/
    // const {openModal} = modalAddProfileActions
    const { addTelegramCode, addTelegramValid } = authActions;

    /** HOOKS*/
    /** управление модальными окнами*/
    const { openModal } = useModal();

    /** Functions*/
    /** Функция отображения попапов уведомлений*/
    const openModalWindow: ForFunc<'modalNotifications' | 'modalSttBonus', void> = React.useCallback(
        (modalName) => {
            openModal(modalName);
        },
        [openModal]
    );

    /** Функция проверки телеграмма*/
    async function prepareTelegram(): Promise<void> {
        try {
            const data: { account: string } = { account: account };
            const response = await axios.post('https://stt.market/api/notifications/create/', data);
            if (response.status === 200) {
                let responseData = response.data;
                if (responseData.status === 400) {
                    openModalWindow('modalNotifications');
                } else if (responseData.status === 200) {
                    dispatch(addTelegramValid(responseData.valid));
                    dispatch(addTelegramCode(responseData.code));
                    openModalWindow('modalNotifications');
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={`${visibility ? cls.wrapper_big : cls.wrapper_compact}`}>
            <div className={cls.cover_block}>
                <CustomButton
                    onClick={() => openModalWindow('modalSttBonus')}
                    classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big : cls.cover_btn_compact}`}
                    classNameBtn={cls.btn_stt_bonus}
                    type='button'
                >
                    <div className={visibility ? cls.btn_stt_text : cls.btn_stt_text_compact}>
                        <img src={visibility ? '/img/giftStt.svg' : '/img/giftCompact.jpg'} alt='pictures' />
                        <div>STT bonus</div>
                    </div>
                </CustomButton>
            </div>
            <div className={cls.cover_block}>
                {/*<CustomButton onClick={prepareTelegram}  classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big_other : cls.cover_btn_compact_other}`} classNameBtn={cls.btn_stt_bonus} type='button'>*/}
                {/*    <img src={visibility ? "/img/notificationsStt.svg" : "/img/notificationsCompact.jpg" } alt="pictures"/>*/}
                {/*</CustomButton>*/}
                <CustomButton
                    classnameWrapper={`${cls.cover_btn} ${visibility ? cls.cover_btn_big_other : cls.cover_btn_compact_other}`}
                    classNameBtn={cls.btn_stt_bonus}
                    type='button'
                >
                    <img src={visibility ? '/img/sentStt.png' : '/img/sendCompact.jpg'} alt='pictures' />
                </CustomButton>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalNotifications} closing={isClosingModalNotifications}>
                    <NotificationTg />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSttBonus} closing={isClosingSttBonus}>
                    <SttBonusWindow />
                </Modal>
            </Portal>
        </div>
    );
};

export default SttBonus;
