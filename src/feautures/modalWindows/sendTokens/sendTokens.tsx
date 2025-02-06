import React, {useState} from 'react';
import CustomInput from "../../../shared/ui/customInput/customInput";
import {Button} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ReactComponent as SvgQr} from '../../../assets/svg/qr.svg';
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {ethers} from "ethers";
import {
    exchangeContractAddress, sttAffiliateAddress,
    tokenContractAbi,
    tokenContractAbiCb31,
    tokenContractAddress, usdtContractAbi, usdtContractAddress,
} from "../../../helpers/contracts";
import cls from './sendTokens.module.scss';
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";


const SendTokens = () => {

    const dispatch = useAppDispatch()

    /** STATES */
    /** Для хранения адреса с инпута, куда осуществлеяется перевод*/
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [transferTokens, setTransferTokens] = useState<string>(``);
    const {provider, account} = useAppSelector(state => state.authSlice)
    const [balance, setBalance] = useState<any>('0');

    const value = React.useDeferredValue(recipientAddress)

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions

    /** FUNCTIONS*/

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(+e.target.value > +balance) {
            setTransferTokens(balance)
        } else {
            setTransferTokens(e.target.value)
        }
    }

    /** для закрытия модального окна*/
    const closeModalSendMoney = () => {
        const modalSendTokens:any = 'modalSendTokens'
        dispatch(closeModal({modalName: modalSendTokens}))
    }

    const sttTokenAddress = "0x1635b6413d900D85fE45C2541342658F4E982185"; // Адрес контракта токена STT

    /**Функция отправки токенов*/
    async function sendTokens(receiver, amount) {
        const signer = await provider.getSigner();

        // Контракт токена STT
        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

        // Получаем decimals для токена
        const decimals = await contractCommon.decimals();
        const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals)); // Преобразуем в нужный формат

        // const res = await calculateTotalAmount(provider, contract, amount);
        // console.log(`res ${res}`)
        // // return

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
            console.log("Transaction sent:", tx.hash);
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
        } catch (error) {
            console.error("Error sending tokens:", error);
        }
    }

    /** Функция проверки баланса*/
    async function checkBalance () {
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

        let totalSt = 0.0
        let totalUs = 0.0
        // setBalance(balance.toString);
        const balance = await provider.getBalance(account);
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
                    setBalance(stBalance)
                })
            })
        })
    }
    checkBalance()




// Функция для получения стоимости газа
//     async function getGasCost(provider, gasEstimate) {
//         const gasPrice = await provider.getGasPrice();
//         return gasPrice.mul(gasEstimate);
//     }
//
// // Функция для получения комиссии контракта
//     async function getContractFee(contract) {
//         const feePercentage = await contract.feePercentage();
//         return feePercentage;
//     }
//
// // Функция для расчёта итоговой суммы
//     async function calculateTotalAmount(provider, contract, transferAmount) {
//         // Оценка газа
//         const gasEstimate = await contract.estimateGas.transfer(recipientAddress, transferAmount);
//
//         // Получение стоимости газа
//         const gasCost = await getGasCost(provider, gasEstimate);
//
//         // Получение комиссии контракта
//         const feePercentage = await getContractFee(contract);
//         const feeAmount = transferAmount.mul(feePercentage).div(100);
//
//         // Итоговая сумма
//         const totalAmount = transferAmount.add(gasCost).add(feeAmount);
//
//         return totalAmount;
//     }


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
                    classNameInput={cls.input_cover}
                >
                    confirm
                </CustomInput>
                <button className={cls.svgQr}><SvgQr className={cls.svgQrs}/></button>
            </div>
            <div className={cls.coverBlockMoney}>
                <div className={cls.tokensForSend}>
                    <div className={cls.value}>
                        <div className={cls.coverTokensInput}>
                            <CustomInput
                                placeholder='0.00'
                                value={transferTokens}
                                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                                type='text'
                                classNameWrapper={cls.wrap_input_tokens}
                                classNameInput={cls.input_cover_tokens}
                                style={{ width: `${transferTokens?.length === 0 ? '4' : transferTokens?.length}ch` }} // Исправлено здесь
                            >
                            </CustomInput>
                        </div>
                       STT
                    </div>
                    <div className={cls.range}>15 - {balance}</div>
                </div>
                <div className={cls.wallet}>
                    <div>8099.00 STT</div>
                </div>
                <div className={cls.textInfo}>
                    <div>to recelve</div>
                    <div>MLM 30%</div>
                </div>
                <Button onClick={() => sendTokens(recipientAddress, transferTokens)}
                        className={cls.btn_send_tokens}>send</Button>
            </div>
        </div>
    );
};

export default SendTokens;