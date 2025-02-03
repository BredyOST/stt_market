import React, {useState} from 'react';
import cls from './styled/sttBonus.module.scss'
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {IndicatorsForUi} from "../../entities/uiInterfaces/uiInterfaces";
import {ReactComponent as SvgGift} from './../../assets/svg/gift.svg';
import {ReactComponent as SvgSend} from './../../assets/svg/sendStt.svg';
import {ReactComponent as SvgNotification} from './../../assets/svg/notificationsStt.svg';
import Portal from "../../shared/ui/portal/portal";
import Modal from "../../shared/ui/modal/modal";
import SendTokens from "../../feautures/modalWindows/sendTokens/sendTokens";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import NotificationTg from "../../feautures/modalWindows/notificationTg/notificationTg";
import axios from "axios";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";

interface ISttBonusProps {
    withoutWallet: any
    account: any
    provider: any
}


const SttBonus = () => {

    const { t, i18n } = useTranslation();

    const dispatch = useAppDispatch();

    /** STATES*/
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const {loggedIn, account } = useAppSelector(state => state.authSlice);
    const {modalNotifications, isClosingModalNotifications} = useAppSelector(state => state.modalWindow)

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions
    const {addTelegramCode, addTelegramValid} = authActions;

    /** Functions*/
    /** Функция отображения попапа уведомлений*/
    const showModalNotifications = () => {
        console.log(11111)
        const modalName:any = 'modalNotifications'
        dispatch(openModal({modalName: modalName}))
    }

    /** Функция проверки телеграмма*/
    async function prepareTelegram() {

        try {
            const data = {'account': account}
            const response = await axios.post('https://stt.market/api/notifications/create/', data)

            if(response.status === 200) {
                let dd = response.data
                if (dd.status === 400) {
                    setToastText(dd.message)
                    setToastErrorShow(true)
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


    /**
     * @referrerAddress - рефер адресс
     * @signer - кого регистрируем
     * */
    // async function registerReferral(referrerAddress) {
    //     const providerMain = provider.provider; // Провайдер, например, MetaMask
    //     const signer = await providerMain.getSigner(); // Получаем подписанта
    //     console.log(signer)
    //     const userAddress = await signer.getAddress();
    //     // console.log(signer.address);
    //     // console.log(accountc)
    //     // console.log(signer)
    //
    //     const referralContractAbi = [
    //         {
    //             "inputs": [],
    //             "name": "getReferrer",
    //             "outputs": [
    //                 {
    //                     "internalType": "address",
    //                     "name": "",
    //                     "type": "address"
    //                 }
    //             ],
    //             "stateMutability": "view",
    //             "type": "function"
    //         },
    //         {
    //             "inputs": [
    //                 {
    //                     "internalType": "address",
    //                     "name": "referrer",
    //                     "type": "address"
    //                 }
    //             ],
    //             "name": "registerReferral",
    //             "outputs": [],
    //             "stateMutability": "nonpayable",
    //             "type": "function"
    //         }
    //     ];
    //
    //     const contract = new ethers.Contract(referrerAddress, referralContractAbi, signer); // Адрес контракта реферальной системы
    //
    //     // console.log(contract);
    //     // const referrer = await contract.getReferrer(account);
    //     // console.log(referrer);
    //
    //     const tx = await contract.registerReferral(referrerAddress); // Регистрируем реферала
    //     // console.log("Referral registered:", tx.hash);
    //
    //     // Ожидаем подтверждения транзакции
    //     // const receipt = await tx.wait();
    //     // console.log("Transaction confirmed:", receipt);
    // }

    return (
        <div className={cls.wrapper}>
            <div className={cls.cover_block}>
                <CustomButton classnameWrapper={cls.cover_btn} classNameBtn={cls.btnStt} indicator={IndicatorsForUi.wallet} type='button'>
                    <div className={cls.textStt}>
                        {/*<SvgGift className={cls.svgGift}/>*/}
                        <img src="/img/giftStt.png" alt="pictures"/>
                        <div>STT bonus</div>
                    </div>
                </CustomButton>
            </div>
            <div className={cls.cover_block}>
                <CustomButton onClick={prepareTelegram}  classnameWrapper={`${cls.cover_btn} ${cls.height}`} classNameBtn={cls.btnStt} indicator={IndicatorsForUi.wallet} type='button'>
                    <img src="/img/notificztionsStt.png" alt="pictures"/>
                    {/*<SvgSend className={cls.svgSend}/>*/}
                </CustomButton>
                <CustomButton classnameWrapper={`${cls.cover_btn} ${cls.height}`} classNameBtn={cls.btnStt}
                              indicator={IndicatorsForUi.wallet} type='button'>
                    {/*<SvgNotification className={cls.svgNotification}/>*/}
                    <img src="/img/sentStt.png" alt="pictures"/>
                </CustomButton>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalNotifications} closing={isClosingModalNotifications}>
                    <NotificationTg/>
                </Modal>
            </Portal>

        </div>
    );
};

export default SttBonus;