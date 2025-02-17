import React, {useState} from 'react';
import CustomInput from "../../../shared/ui/customInput/customInput";
import {Button} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ReactComponent as SvgQr} from '../../../assets/svg/qr.svg';
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {ethers} from "ethers";
import {
   sttAffiliateAddress,
    tokenContractAbi,
    tokenContractAbiCb31,
    tokenContractAddress,
} from "../../../helpers/contracts";
import cls from './sendTokens.module.scss';
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {useTranslation} from "react-i18next";
import {showAttention} from "../../../shared/helpers/attention";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";
import {walletActions} from "../../../shared/redux/slices/walletSlice/walletSlice";
import {IModalWindowStatesSchema} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";


const SendTokens = () => {

    const dispatch = useAppDispatch()
    const {t} = useTranslation();

    /** STATES */
    /** Для хранения адреса с инпута, куда осуществлеяется перевод*/
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [transferTokens, setTransferTokens] = useState<string>('0');
    const {provider} = useAppSelector(state => state.authSlice)
    const [sendTokensValue, setSendTokensValue] = useState<string>('0');
    const [mlm, setMlm] = React.useState<number>(0);
    const [validateAddress, setValidateAddress] = useState<boolean>(false)

    const deferredAddress = React.useDeferredValue(recipientAddress)

    const {successTransferTokens, sttBalance} = useAppSelector(state => state.walletSlice)

    /** ACTIONS*/
    const {closeModal } = modalAddProfileActions
    const {addLoader} = authActions;
    const {addSuccessTransferToken } = walletActions;

    /** FUNCTIONS*/

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e:React.ChangeEvent<HTMLInputElement>) => {

        const inputValue = e.target.value;

        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue)

        if(number > +sttBalance) {
            setTransferTokens(sttBalance.toString())
            calculateReceivedAmount(sttBalance)
        } else if(inputValue.length === 0) {
            setTransferTokens('0')
            setSendTokensValue('0')
        } else {
            setTransferTokens(inputValue)
            calculateReceivedAmount(inputValue)
        }
    }

    /** для закрытия модального окна*/
    const closeModalSendMoney = () => {
        const modalSendTokens:string = 'modalSendTokens'
        dispatch(closeModal({modalName: modalSendTokens as keyof IModalWindowStatesSchema}))
    }


    /**Функция отправки токенов*/
    async function sendTokens(receiver, amount) {

        if (!validateAddress) {
            showAttention(`Please check the entered ERC20 account.`, 'error')
            return
        }

        if (+transferTokens <= 0) {
            showAttention(`Please enter tokens for transfer`, 'error')
            return
        }

            dispatch(addLoader(true))
            const signer = await provider.getSigner();

            // Контракт токена STT
            const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
            const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

            // Получаем decimals для токена
            const decimals = await contractCommon.decimals();
            const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals)); // Преобразуем в нужный формат

            // Проверяем allowance (разрешение) перед approve
            const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), receiver);
            console.log("Allowance before approve:", allowanceBefore.toString());

            // Выполняем approve
            // const txApprove = await contractCommon.approve(receiver, tokenAmount);
            const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);

            console.log("Approve transaction sent:", txApprove.hash);
            const receiptApprove = await txApprove.wait();
            console.log("Approve transaction confirmed:", receiptApprove);

            // Проверяем allowance после approve
            const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), receiver);
            console.log("Allowance after approve:", allowanceAfter.toString());

            // Проверяем баланс подписанта
            const balance = await contractCommon.balanceOf(await signer.getAddress());
            console.log("Balance:", balance.toString());

            // Выполняем перевод токенов
            try {
                const tx = await contract.paymentFromTheShop(receiver, tokenAmount); // Используем transfer для перевода токенов
                // console.log("Transaction sent:", tx?.hash);
                showAttention(`Transaction sent`, 'success')
                const receipt = await tx.wait();
                console.log("Transaction confirmed:", receipt);
                showAttention(`Transaction confirmed:, ${receipt}`, 'success')
                setTransferTokens('0')
                setSendTokensValue('0')
                closeModalSendMoney()
                // checkBalance()
            } catch (error) {
                showAttention(`Error sending tokens`, 'error')
                console.error("Error sending tokens:", error);
            } finally {
                dispatch(addSuccessTransferToken(!successTransferTokens))
                dispatch(addLoader(false))
            }
    }

    /** проверка адреса*/
     async function isValidAddress (address: string): Promise<void>  {
        const res = await ethers.isAddress(address);
        if(res) {
            setValidateAddress(true)
        } else {
            setValidateAddress(false)
        }
    }


    /** Функция расчета итоговой суммы с учетом комиссии */
    async function calculateReceivedAmount(amount) {

        if(!amount) {
            setSendTokensValue('0')
            setMlm(30)
            return
        }

        try {
            const signer = await provider.getSigner();
            const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
            const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

            // Получаем decimals для токена
            const decimals = await contractCommon.decimals();
            const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals));
            // Получаем маркетинговую ставку (если есть метод в контракте)
            let rate = 30
                if(validateAddress) {
                    rate = await contract.marketingRate(deferredAddress);
                    setMlm(rate)
                }
            const externalFee = tokenAmount * BigInt(1) / BigInt(100); // Внешняя комиссия 1%
            const paymentBase = tokenAmount - externalFee;
            const receiverAmount = paymentBase * (100n - BigInt(rate)) / 100n;

            const result =  ethers.formatUnits(receiverAmount, parseInt(decimals));
            // setSendTokensValue(+Number(result)?.toFixed(2));
            setSendTokensValue(String(+Number(result)?.toFixed(2)));


        } catch (error) {
            console.error("Error calculating received amount:", error);
            return null;
        }
    }

    React.useEffect(() => {
        if(deferredAddress.length >= 1) {
            isValidAddress(deferredAddress)
        } else {
            setValidateAddress(false)
        }
    }, [deferredAddress])

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={cls.notification_header}>SEND</div>
                <CustomButton onClick={closeModalSendMoney} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg} />
                </CustomButton>
            </div>
            <div className={cls.cover_text_block}>
                <CustomInput
                    placeholder='ERC20'
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    type='text'
                    classNameWrapper={cls.wrap_input}
                    classNameInput={`${cls.input_cover} ${deferredAddress?.length >= 1 && !validateAddress && cls.notValidated}`}
                >
                    confirm
                </CustomInput>
                <button className={cls.svgQr}><SvgQr className={cls.svgQrs}/></button>
            </div>
            <div className={cls.cover_block_money}>
                <div className={cls.tokensForSend}>
                    <div className={cls.value}>
                        <div className={cls.coverTokensInput}>
                            <CustomInput
                                placeholder='0.00'
                                value={transferTokens == '0' ? '' : transferTokens}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                                type='text'
                                classNameWrapper={cls.wrap_input_tokens}
                                classNameInput={cls.input_cover_tokens}
                                style={{
                                    width: `${transferTokens?.length === 0 ? '4ch' : transferTokens?.length}ch`,
                                    minWidth: '4ch',
                                    maxWidth: '8ch'
                                }}

                            >
                            </CustomInput>
                        </div>
                       STT
                    </div>
                    <div className={cls.range}>15 - {sttBalance}</div>
                </div>
                <div className={cls.wallet}>
                    <div>{sendTokensValue == '0' ? `0.00` : sendTokensValue} STT</div>
                </div>
                {mlm > 0 &&
                    <div className={cls.textInfo}>
                        <div>to recelve</div>
                        <div>MLM {mlm}%</div>
                    </div>
                }
                <Button onClick={() => sendTokens(recipientAddress, transferTokens)}
                        className={cls.btn_send_tokens}>
                {t("send")}
                </Button>
            </div>
        </div>
    );
};

export default SendTokens;