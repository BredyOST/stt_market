import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {
    exchangeContractAddress,
    tokenContractAbi, tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress
} from "../../helpers/contracts";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import cls from './wallet.module.scss';
import {ReactComponent as SvgArrowRight} from "./../../assets/svg/arrow-rigth.svg";
import {ReactComponent as SvgSwap} from "./../../assets/svg/swap.svg";
import {ReactComponent as SvgDonation} from "./../../assets/svg/donation.svg";
import {ReactComponent as SvgGift} from "./../../assets/svg/gift.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import SendTokens from "../../feautures/modalWindows/sendTokens/sendTokens";
import Modal from "../../shared/ui/modal/modal";
import Portal from "../../shared/ui/portal/portal";
import Swap from "../../feautures/modalWindows/swap/swap";
import Donation from "../../feautures/modalWindows/donation/donation";
import {ForFunc} from "../../entities/others";
import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {walletActions} from "../../shared/redux/slices/walletSlice/walletSlice";

function Wallet(props) {

    const dispatch = useAppDispatch()

    /** states */
    const {provider, account} = useAppSelector(state => state.authSlice)
    const {modalSendTokens, modalSwap, modalDonation, isClosingModalSendTokens, isClosingModalSwap, isClosingModalDonation} = useAppSelector(state => state.modalWindow)
    const {successTransferTokens, successSwap,sttBalance, etcBalance, helpUsdtBalance, usdtBalance} = useAppSelector(state => state.walletSlice)

    /** actions*/
    const {openModal} = modalAddProfileActions
    const {addSuccessTransferToken, addBalanceStt, addUdtStt, addEtcStt, addHelpUsdt} = walletActions;

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    useEffect(() => {
        if (account && provider) {
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);
            let totalSt = 0.0
            let totalUs = 0.0
            contract.totalSupply().then(res => {
                totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
                usdtContract.balanceOf(exchangeContractAddress).then(res => {
                    totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2)
                    contract.balanceOf(account).then(res => {
                        let stBalance:any = (parseFloat(String((Number(res) / Math.pow(10, 9)) - 0.01)).toFixed(2))
                        if (+stBalance < 0) {
                            stBalance = 0.0
                        }
                        let rate = totalUs / totalSt
                        let usBalance = (parseInt(String(parseFloat(String((rate * stBalance))) * 100)) /100)
                        dispatch(addBalanceStt(stBalance))
                        dispatch(addHelpUsdt(usBalance))
                    })
                })
            })
            usdtContract.balanceOf(account).then(res => {
                let walletUsdtBalance = (parseInt(String(parseFloat(String(Number(res) / Math.pow(10, 6))) * 100)) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',')
                dispatch(addUdtStt(+walletUsdtBalance))

            })
            provider?.getBalance(account).then((balance) => {
                const balanceInEth = parseFloat(ethers.formatEther(balance)).toFixed(5).toString().replace('.', ',')
                dispatch(addEtcStt(Number(balanceInEth.replace(',', '.'))))
            })
        }
        dispatch(addSuccessTransferToken(false))
    }, [account, successTransferTokens, successSwap]);

    /**Functions*/
    /** для отображения попапа отправки токенов*/
    const showModalSendMoney:ForFunc<void, void> = () => {
        const modalSendTokens:string = 'modalSendTokens'
        dispatch(openModal({modalName: modalSendTokens as keyof IModalWindowStatesSchema}))
    }
    /** для отображения попапа swap*/
    const showModalSendSwap = () => {
        const modalSwapTokens:string = 'modalSwap'
        dispatch(openModal({modalName: modalSwapTokens as keyof IModalWindowStatesSchema}))
    }
    /** для отображения попапа донатов*/
    const sendDonation = () => {
        const modalDonat:string = 'modalDonation'
        dispatch(openModal({modalName: modalDonat as keyof IModalWindowStatesSchema}))
    }

    return (
        <>
            <div className={cls.wrapper}>
                <div className={cls.cover_price}>
                    <div className={cls.balance_values}>
                        <div className={cls.balance_values_usdt}>{numberWithCommas(helpUsdtBalance)} USDT</div>
                        <div className={cls.balance_values_usd}>{etcBalance} ETH</div>
                    </div>
                    <div className={cls.balance_stt}>
                        <a className={cls.balance_stt_ink}
                           href={account ? "https://arbiscan.io/address/" + account : "#!"}
                           target={account && "_blank"} rel={account && "noreferrer"}
                        >
                            <span className={cls.stt_balance}>{numberWithCommas(sttBalance)} STT</span>
                            <span className={cls.balance_values_usd}>12 $</span>
                        </a>

                    </div>
                    <div className={cls.balance_values_usd_cover}>
                    <div className={cls.block_action_btns}>
                        <CustomButton classnameWrapper={cls.btn_wrapper} classNameBtn={cls.btn_send_tokens} type='button' onClick={showModalSendMoney}>
                            <SvgArrowRight className={cls.btnSenTokensSvg}/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.btn_wrapper} classNameBtn={cls.btn_swap_tokens} type='button' onClick={showModalSendSwap}>
                            <SvgSwap className={cls.btnSwapSvg}/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.btn_wrapper} classNameBtn={cls.btn_donation} type='button' onClick={sendDonation}>
                            <SvgDonation className={cls.btnDonationSvg}/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.btn_wrapper} classNameBtn={cls.btn_gift} type='button'>
                            <SvgGift className={cls.btnGiftSvg}/>
                        </CustomButton>
                    </div>
                    </div>
                </div>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSendTokens} closing={isClosingModalSendTokens}>
                    <SendTokens/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSwap} closing={isClosingModalSwap}>
                    <Swap/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalDonation} closing={isClosingModalDonation}>
                    <Donation/>
                </Modal>
            </Portal>
        </>
    )
}

export default Wallet;