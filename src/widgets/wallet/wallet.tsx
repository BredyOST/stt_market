import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
    exchangeContractAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress,
} from '../../helpers/contracts';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import cls from './wallet.module.scss';
import { ReactComponent as SvgArrowRight } from './../../assets/svg/arrow-rigth.svg';
import { ReactComponent as SvgSwap } from './../../assets/svg/swap.svg';
import { ReactComponent as SvgDonation } from './../../assets/svg/donation.svg';
import { ReactComponent as SvgGift } from './../../assets/svg/gift.svg';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import SendTokens from '../../feautures/modalWindows/sendTokens/sendTokens';
import Modal from '../../shared/ui/modal/modal';
import Portal from '../../shared/ui/portal/portal';
import Swap from '../../feautures/modalWindows/swap/swap';
import Donation from '../../feautures/modalWindows/donation/donation';
import { ForFunc } from '../../entities/others';
import { walletActions } from '../../shared/redux/slices/walletSlice/walletSlice';
import { useAuthState, useModal, useWallet } from '../../shared/helpers/hooks';
import SttBonus from '../../feautures/modalWindows/sttBonus/sttBonus';

interface IWalletProps {
    className: string;
}

function Wallet({ className }: IWalletProps) {
    const dispatch = useAppDispatch();

    /** states */
    const { provider, account } = useAppSelector((state) => state.authSlice);
    const {
        modalSendTokens,
        modalSwap,
        modalDonation,
        isClosingModalSendTokens,
        isClosingModalSwap,
        isClosingModalDonation,
        modalSttBonus,
        isClosingSttBonus,
    } = useAppSelector((state) => state.modalWindow);
    const { successTransferTokens, successSwap, sttBalance, etcBalance, helpUsdtBalance, usdtBalance } = useAppSelector(
        (state) => state.walletSlice
    );

    /** actions*/
    const { addSuccessTransferToken } = walletActions;

    /** HOOKS*/
    /** изменение состояний walletSlice*/
    const updateWalletState = useWallet();
    /** управление модальными окнами*/
    const { openModal } = useModal();
    /** изменение состояний authSlice*/
    const updateAuthState = useAuthState();

    /**FUNCTIONS*/
    /** для отображения попапов отправки токенов*/
    const openModalWindow: ForFunc<
        { modalName: 'modalSendTokens' | 'modalSwap' | 'modalDonation'; toTheShopTransfer?: 'fromTheShop' | 'toTheShop' },
        void
    > = ({ modalName, toTheShopTransfer = null }) => {
        openModal(modalName);
        if (toTheShopTransfer === 'fromTheShop') {
            updateAuthState('transferToTheShop', false);
        } else if (toTheShopTransfer === 'toTheShop') {
            updateAuthState('transferToTheShop', true);
        }
    };

    function numberWithCommas(x: number): string {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    /** получаем токены*/
    const fetchBalanceData = async () => {
        try {
            if (!account || !provider) return;

            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

            const res = await contract.totalSupply();

            const totalSt = +(Number(await contract.totalSupply()) / Math.pow(10, 9)).toFixed(2);

            const totalUs = +(Number(await usdtContract.balanceOf(exchangeContractAddress)) / Math.pow(10, 6)).toFixed(2);
            const stBalance = +(Number(await contract.balanceOf(account)) / Math.pow(10, 9) - 0.01).toFixed(2);

            const rate = totalUs / totalSt;
            const usBalance = (rate * stBalance).toFixed(2);

            updateWalletState('sttBalance', stBalance);
            updateWalletState('helpUsdtBalance', +usBalance);

            const walletUsdtBalance = (Number(await usdtContract.balanceOf(account)) / Math.pow(10, 6)).toFixed(2);
            updateWalletState('usdtBalance', +walletUsdtBalance);

            const balanceInEth = parseFloat(ethers.formatEther(await provider.getBalance(account))).toFixed(5);
            updateWalletState('etcBalance', +balanceInEth);

            dispatch(addSuccessTransferToken(false));
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        fetchBalanceData();
    }, [account, successTransferTokens, successSwap]);

    return (
        <>
            <div className={`${cls.wrapper} ${className}`}>
                <div className={cls.cover_price}>
                    <div className={cls.balance_values}>
                        <div className={cls.balance_values_usdt}>{numberWithCommas(usdtBalance)} USDT</div>
                        <div className={cls.balance_values_usd}>{etcBalance} ETH</div>
                    </div>
                    <div className={cls.balance_stt}>
                        <a
                            className={cls.balance_stt_ink}
                            href={account ? 'https://arbiscan.io/address/' + account : '#!'}
                            target={account && '_blank'}
                            rel={account && 'noreferrer'}
                        >
                            <span className={cls.stt_balance}>{numberWithCommas(sttBalance)} STT</span>
                            <span className={cls.balance_values_usd}>12 $</span>
                        </a>
                    </div>
                    <div className={cls.balance_values_usd_cover}>
                        <div className={cls.block_action_btns}>
                            <CustomButton
                                classnameWrapper={cls.btn_wrapper}
                                classNameBtn={cls.btn_send_tokens}
                                type='button'
                                onClick={() => openModalWindow({ modalName: `modalSendTokens`, toTheShopTransfer: 'toTheShop' })}
                            >
                                <SvgArrowRight className={cls.btnSenTokensSvg} />
                            </CustomButton>
                            <CustomButton
                                classnameWrapper={cls.btn_wrapper}
                                classNameBtn={cls.btn_swap_tokens}
                                type='button'
                                onClick={() => openModalWindow({ modalName: `modalSwap` })}
                            >
                                <SvgSwap className={cls.btnSwapSvg} />
                            </CustomButton>
                            <CustomButton
                                classnameWrapper={cls.btn_wrapper}
                                classNameBtn={cls.btn_donation}
                                type='button'
                                onClick={() => openModalWindow({ modalName: 'modalDonation' })}
                            >
                                <SvgDonation className={cls.btnDonationSvg} />
                            </CustomButton>
                            <CustomButton
                                classnameWrapper={cls.btn_wrapper}
                                classNameBtn={cls.btn_gift}
                                type='button'
                                onClick={() => openModalWindow({ modalName: `modalSendTokens`, toTheShopTransfer: 'fromTheShop' })}
                            >
                                <SvgGift className={cls.btnGiftSvg} />
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSendTokens} closing={isClosingModalSendTokens}>
                    <SendTokens />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSwap} closing={isClosingModalSwap}>
                    <Swap />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalDonation} closing={isClosingModalDonation}>
                    <Donation />
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSttBonus} closing={isClosingSttBonus}>
                    <SttBonus />
                </Modal>
            </Portal>
        </>
    );
}

export default Wallet;
