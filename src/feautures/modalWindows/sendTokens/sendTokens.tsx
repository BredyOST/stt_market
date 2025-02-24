import React, { useState } from 'react';
import CustomInput from '../../../shared/ui/customInput/customInput';
import { Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../shared/redux/hooks/hooks';
import { ReactComponent as SvgQr } from '../../../assets/svg/qr.svg';
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import { ethers } from 'ethers';
import { sttAffiliateAddress, tokenContractAbi, tokenContractAbiCb31, tokenContractAddress } from '../../../shared/const/contracts';
import cls from './sendTokens.module.scss';
import CustomButton from '../../../shared/ui/сustomButton/CustomButton';
import { useTranslation } from 'react-i18next';
import { showAttention } from '../../../shared/helpers/attention';
import { authActions } from '../../../shared/redux/slices/authSlice/authSlice';
import { walletActions } from '../../../shared/redux/slices/walletSlice/walletSlice';
import { useAuthState, useModal, useProfile } from '../../../shared/helpers/hooks';
import { INFO_USER_SEND_TOKENS } from '../../../shared/const/index.const';
import { ForFunc, IInfoUserInHeader, labelProfileInfo } from '../../../entities/others';

const SendTokens = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();

    /** STATES */
    /** Для хранения адреса с инпута, куда осуществлеяется перевод*/
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [transferTokens, setTransferTokens] = useState<string>('0');
    const [sendTokensValue, setSendTokensValue] = useState<string>('0');
    const [mlm, setMlm] = React.useState<number>(30);
    const [validateAddress, setValidateAddress] = useState<boolean>(false);

    const deferredAddress = React.useDeferredValue(recipientAddress);

    const { successTransferTokens, sttBalance } = useAppSelector((state) => state.walletSlice);
    const { provider, transferToTheShop, donateWalletFromReals } = useAppSelector((state) => state.authSlice);
    const { finishedQrScannerSendTokens, finishedQrScannerReals, erc20FromQrForSendFrom } = useAppSelector((state) => state.userProfiles);

    /** ACTIONS*/
    const { addLoader } = authActions;
    const { addSuccessTransferToken } = walletActions;

    /** управление модальными окнами*/
    const { closeModal, openModal } = useModal();
    /** изменение состояний authSlice*/
    const updateAuthState = useAuthState();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    /** FUNCTIONS*/
    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue);

        if (number > +sttBalance) {
            setTransferTokens(sttBalance.toString());
            calculateReceivedAmount(sttBalance);
        } else if (inputValue.length === 0) {
            setTransferTokens('0');
            setSendTokensValue('0');
        } else {
            setTransferTokens(inputValue);
            calculateReceivedAmount(inputValue);
        }
    };

    /** для закрытия модального окна*/
    const closeModalSendMoney = () => {
        closeModal('modalSendTokens');
        updateAuthState('transferToTheShop', null);
        updateAuthState('donateWalletFromReals', null);
        setRecipientAddress('');
    };

    const closeForOpenQRModal = () => {
        closeModal('modalSendTokens');
        setRecipientAddress('');
        updateAuthState('donateWalletFromReals', null);
    };

    /** FUNCTIONS*/
    const openQrScanner: ForFunc<void, void> = () => {
        if (finishedQrScannerReals) {
            updateProfileServiceState('finishedQrScannerReals', false);
        }
        closeForOpenQRModal();
        updateProfileServiceState('finishedQrScannerSendTokens', true);
        openModal('modalQrScan');

        if (erc20FromQrForSendFrom) {
            setRecipientAddress(erc20FromQrForSendFrom);
        }
    };

    /**Функция отправки токенов*/
    async function sendTokens(receiver, amount) {
        if (!validateAddress) {
            showAttention(`Please check the entered ERC20 account.`, 'error');
            return;
        }

        if (+transferTokens <= 0) {
            showAttention(`Please enter tokens for transfer`, 'error');
            return;
        }

        dispatch(addLoader(true));
        updateAuthState('textInfo', 'preparation for the transaction.');

        const signer = await provider.getSigner();

        // Контракт токена STT
        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

        // Получаем decimals для токена
        const decimals = await contractCommon.decimals();
        const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals)); // Преобразуем в нужный формат

        // Проверяем allowance (разрешение) перед approve
        const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), receiver);
        console.log('Allowance before approve:', allowanceBefore.toString());

        // Выполняем approve
        updateAuthState('textInfo', 'Waiting for approve transaction confirmation');
        const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);

        console.log('Approve transaction sent:', txApprove.hash);
        const receiptApprove = await txApprove.wait();
        console.log('Approve transaction confirmed:', receiptApprove);

        updateAuthState('textInfo', 'Approve transaction confirmed');

        // Проверяем allowance после approve
        const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), receiver);
        console.log('Allowance after approve:', allowanceAfter.toString());

        // Проверяем баланс подписанта
        const balance = await contractCommon.balanceOf(await signer.getAddress());
        console.log('Balance:', balance.toString());

        // Выполняем перевод токенов
        try {
            updateAuthState('textInfo', 'Preparing token transfer');

            let tx = null;
            if (transferToTheShop) {
                tx = await contract.paymentToTheShop(receiver, tokenAmount);
            } else {
                tx = await contract.paymentFromTheShop(receiver, tokenAmount);
            }

            updateAuthState('textInfo', 'Transaction sent');
            showAttention(`Transaction sent`, 'success');

            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            showAttention(`Transaction confirmed`, 'success');
            setTransferTokens('0');
            setSendTokensValue('0');
            closeModalSendMoney();

            // checkBalance()
        } catch (error) {
            showAttention(`Error sending tokens`, 'error');
            console.error('Error sending tokens:', error);
        } finally {
            dispatch(addSuccessTransferToken(!successTransferTokens));
            dispatch(addLoader(false));
            updateAuthState('transferToTheShop', null);
            updateAuthState('textInfo', null);
        }
    }

    /** проверка адреса*/
    async function isValidAddress(address: string): Promise<void> {
        const res = await ethers.isAddress(address);
        if (res) {
            setValidateAddress(true);
        } else {
            setValidateAddress(false);
        }
    }

    /** Функция расчета итоговой суммы с учетом комиссии */
    async function calculateReceivedAmount(amount) {
        if (!amount) {
            setSendTokensValue('0');
            setMlm(30);
            return;
        }

        try {
            const signer = await provider.getSigner();
            const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
            const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

            // Получаем decimals для токена
            const decimals = await contractCommon.decimals();
            const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals));
            // Получаем маркетинговую ставку (если есть метод в контракте)
            let rate = 30;
            if (validateAddress) {
                rate = await contract.marketingRate(deferredAddress);
                setMlm(rate);
            }
            const externalFee = (tokenAmount * BigInt(1)) / BigInt(100); // Внешняя комиссия 1%
            const paymentBase = tokenAmount - externalFee;
            const receiverAmount = (paymentBase * (100n - BigInt(rate))) / 100n;

            const result = ethers.formatUnits(receiverAmount, parseInt(decimals));
            setSendTokensValue(String(+Number(result)?.toFixed(2)));
        } catch (error) {
            console.error('Error calculating received amount:', error);
            return null;
        }
    }

    React.useEffect(() => {
        if (deferredAddress.length >= 1) {
            isValidAddress(deferredAddress);
        } else {
            setValidateAddress(false);
        }
    }, [deferredAddress]);

    const changeReceiptAdress: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = (e) => {
        setRecipientAddress(e.target.value);
    };

    React.useEffect(() => {
        if (erc20FromQrForSendFrom?.length) {
            setRecipientAddress(erc20FromQrForSendFrom);
        }
    }, [erc20FromQrForSendFrom]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={transferToTheShop ? cls.notification_header : cls.notification_header_blue}>SEND</div>
                <CustomButton onClick={closeModalSendMoney} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg} />
                </CustomButton>
            </div>
            <div className={cls.cover_text_block}>
                <CustomInput
                    placeholder='ERC20'
                    value={donateWalletFromReals ? donateWalletFromReals : recipientAddress}
                    onChange={(e) => changeReceiptAdress(e)}
                    type='text'
                    classNameWrapper={cls.wrap_input}
                    classNameInput={`${cls.input_cover} ${deferredAddress?.length >= 1 && !validateAddress && cls.notValidated} ${donateWalletFromReals && cls.no_padding_right}`}
                    disable={donateWalletFromReals ? true : false}
                >
                    confirm
                </CustomInput>
                {!donateWalletFromReals && (
                    <CustomButton type='button' onClick={openQrScanner} classNameBtn={cls.svgQr}>
                        <SvgQr className={cls.svgQrs} />
                    </CustomButton>
                )}
            </div>
            <div className={cls.wrapper_header}>
                <div className={cls.logo}>
                    <img className={cls.svgLogo} src='/test.jpg' alt='pictures' />
                </div>
                <div className={cls.info_user}>
                    <div className={cls.name_user}>
                        <div className={cls.name}>Your Name</div>
                        <div className={cls.status}>creator</div>
                    </div>
                    <div className={cls.interaction_block}>
                        {INFO_USER_SEND_TOKENS?.length > 0 &&
                            INFO_USER_SEND_TOKENS.map((item: IInfoUserInHeader) => (
                                <div key={item.id} className={cls.info_block}>
                                    {item.svg}
                                    <div>
                                        {item.label === labelProfileInfo.donations && <div>18</div>}
                                        {item.label === labelProfileInfo.favourites && <div>1.8M</div>}
                                        {item.label === labelProfileInfo.subscribers && <div>1.8k</div>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className={cls.cover_block_money}>
                <div className={cls.tokensForSend}>
                    <div className={cls.value}>
                        <div className={cls.coverTokensInput}>
                            <CustomInput
                                placeholder='0.00'
                                value={transferTokens == '0' ? '' : transferTokens}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                                type='text'
                                classNameWrapper={cls.wrap_input_tokens}
                                classNameInput={cls.input_cover_tokens}
                                style={{
                                    width: `${transferTokens?.length === 0 ? '4ch' : transferTokens?.length}ch`,
                                    minWidth: '4ch',
                                    maxWidth: '8ch',
                                }}
                            ></CustomInput>
                        </div>
                        STT
                    </div>
                    <div className={cls.range}>15 - {sttBalance}</div>
                </div>
                <div className={cls.wallet}>
                    <div>{sendTokensValue == '0' ? `0.00` : sendTokensValue} STT</div>
                </div>
                {mlm > 0 && (
                    <div className={cls.textInfo}>
                        <div>to recelve</div>
                        <div>MLM {mlm}%</div>
                    </div>
                )}
            </div>
            <div className={cls.cover_btn}>
                <Button onClick={() => sendTokens(recipientAddress, transferTokens)} className={cls.btn_send_tokens}>
                    {t('send')}
                </Button>
            </div>
        </div>
    );
};

export default SendTokens;
