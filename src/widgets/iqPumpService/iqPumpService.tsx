import React, {useState} from 'react';
import cls from './iqPumpService.module.scss';
import {ReactComponent as SvgBrain} from "./../../assets/svg/brain.svg";
import CustomInput from "../../shared/ui/customInput/customInput";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import {showAttention} from "../../shared/helpers/attention";
import {ethers} from "ethers";
import {
    sttAffiliateAddress,
    tokenContractAbi,
    tokenContractAbiCb31,
    tokenContractAddress
} from "../../helpers/contracts";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import {walletActions} from "../../shared/redux/slices/walletSlice/walletSlice";



//
// export type userIqPumpInfo = {
//     user_wallet:string,
//     tg_user_name:string,
// }
//
// export type request_iq_pump = userIqPumpInfo & {
//     tg_user_name:string,
//     balance_stt:string,
// }
//
// export type BalanceReplenishment = {
//     hash_transaction:string,
//     amount_stt:string
// }
//
// export type TokenWithdrawal = {
//     amount_stt:string,
//     user_wallet:string
// }
//
// /** запрос №1: Получение данных из игры iq pump при входе в учетную запись*/
// /**
//  @user_wallet_iq_pump - адрес кошелька пользователя
//  @tg_user_name - user name из tg
//  */
// const userInfo:userIqPumpInfo = {
//     user_wallet:'0x87230b444a70D31543A598350F244e15DCDB92c0',
//     tg_user_name:'@user_name'
// }
//
// /** ответ на запрос №1*/
// const response:request_iq_pump = {
//     user_wallet:'0x87230b444a70D31543A598350F244e15DCDB92c0',
//     tg_user_name:'@user_name',
//     balance_stt:'329756',
// }
//
// /** Запрос №2: отправка запрос нв пополнение баланса, после успешного перевода методом "перевод магазину" */
// /**
//  * передаю хеш транзакции и сумму токенов, которую вводил пользователь
//  */
// const transactionSuccess:BalanceReplenishment = {
//     hash_transaction:'0xcc65f5a24304d45f465858a97fc54f95e8578645d2068a9786eed6ce8c03b333',
//     amount_stt: '1382'
// }
//
//
// /** Запрос №3: Вывод токенов из игры*/
// /**
//  * Передаю сумму токенов для вывода и кошелек пользователя
//  * */
// const tokenWithdrawal:TokenWithdrawal = {
//     amount_stt: '2000',
//     user_wallet:'0x87230b444a70D31543A598350F244e15DCDB92c0',
// }
// /** Ответ на запрос №3*/
// const response = {
//     user_wallet:'0x87230b444a70D31543A598350F244e15DCDB92c0',
//     balance_stt:'329756',
//     success_transfer: true
// }





const ERC =`0x9aF049415f94F776c5157a6EA97097B92D83e3A9`;

const IqPumpService = () => {

    const dispatch = useAppDispatch()

    const {account, telegramUsername } = useAppSelector(state => state.authSlice);
    const [validateAddress, setValidateAddress] = useState<boolean>(false)
    const [transferTokens, setTransferTokens] = useState<string>('0');
    const {provider} = useAppSelector(state => state.authSlice)
    const [sendTokensValue, setSendTokensValue] = useState<string>('0');
    const {successTransferTokens, sttBalance} = useAppSelector(state => state.walletSlice)
    const [mlm, setMlm] = React.useState<number>(0);


    /** ACTIONS*/
    const {addLoader} = authActions;
    const {addSuccessTransferToken } = walletActions;


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

    /** Функция расчета итоговой суммы с учетом комиссии */
    async function calculateReceivedAmount(amount) {
        if (!amount) {
            setSendTokensValue('0');
            setMlm(30);
            return;
        }

        try {
            const signer = await provider.getSigner();
            // Контракт для получения decimals (обычно токена)
            const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
            // Контракт для маркетинговой ставки и других настроек
            const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

            // Получаем количество десятичных знаков токена
            const decimals = await contractCommon.decimals();
            // Преобразуем введённое значение в BigNumber с учетом decimals
            const tokenAmount = ethers.parseUnits(amount.toString(), parseInt(decimals));

            // По умолчанию маркетинговая ставка равна 30%
            let rate = 30;
            // Если адрес валидный, получаем актуальную ставку из контракта
                rate = await contract.marketingRate(ERC);
                setMlm(rate);

            // Вычисляем внешнюю комиссию (например, 1% от суммы)
            const externalFee = tokenAmount * BigInt(1) / BigInt(100);
            // Определяем сумму после вычета внешней комиссии
            const paymentBase = tokenAmount - externalFee;

            // Расчёт суммы, которая будет отправлена получателю:
            // receiverAmount = paymentBase * (100 - rate) / 100
            const receiverAmount = paymentBase * (100n - BigInt(rate)) / 100n;

            // Форматируем итоговую сумму для отображения (до 2 знаков после запятой)
            const result = ethers.formatUnits(receiverAmount, parseInt(decimals));
            setSendTokensValue(String(+Number(result).toFixed(2)));

        } catch (error) {
            console.error("Error calculating received amount:", error);
            return null;
        }
    }



    /**Функция отправки токенов*/
    async function sendTokens() {

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
        const tokenAmount = ethers.parseUnits(transferTokens.toString(), parseInt(decimals)); // Преобразуем в нужный формат

        // Проверяем allowance (разрешение) перед approve
        const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), ERC);
        console.log("Allowance before approve:", allowanceBefore.toString());

        // Выполняем approve
        // const txApprove = await contractCommon.approve(receiver, tokenAmount);
        const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);

        console.log("Approve transaction sent:", txApprove.hash);
        const receiptApprove = await txApprove.wait();
        console.log("Approve transaction confirmed:", receiptApprove);

        // Проверяем allowance после approve
        const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), ERC);
        console.log("Allowance after approve:", allowanceAfter.toString());

        // Проверяем баланс подписанта
        const balance = await contractCommon.balanceOf(await signer.getAddress());
        console.log("Balance:", balance.toString());

        // Выполняем перевод токенов
        try {
            const tx = await contract.paymentToTheShop(ERC, tokenAmount); // Используем transfer для перевода токенов
            console.log("Transaction sent:", tx?.hash);
            showAttention(`Transaction sent`, 'success')
            const receipt = await tx.wait();
            console.log("Transaction confirmed:", receipt);
            showAttention(`Transaction confirmed:, ${receipt}`, 'success')
            setTransferTokens('0')
            setSendTokensValue('0')
            // checkBalance()
        } catch (error) {
            showAttention(`Error sending tokens`, 'error')
            console.error("Error sending tokens:", error);
        } finally {
            dispatch(addSuccessTransferToken(!successTransferTokens))
            dispatch(addLoader(false))
        }
    }


    return (

        // <div className={cls.wrapper_main}>
        //     <div className={cls.cover_sub_title}>
        //         <h3 className={cls.title_main}>
        //                 Our services
        //         </h3>
        //     </div>
        //     <div className={cls.services}>
        //         <SvgBrain className={cls.svg_brain_block}/>
        //         <h3 className={cls.title_iq_pump}>IQ PUPMP</h3>
        //     </div>
        // </div>

        <div className={cls.wrapper}>
            <div className={cls.title_cover}>
                <h3 className={cls.title}>IQ PUMP</h3>
                <SvgBrain className={cls.svg_brain}/>
                <div className={cls.th_info}>
                    <div className={cls.user_name_tg}>{telegramUsername}</div>
                    <div className={cls.adress}>{`${account?.slice(0,10)}...${account?.slice(35)}`}</div>
                </div>
            </div>
            <div className={cls.balance_block}>
                    <h3 className={cls.subtitle_block}>balance</h3>
                    <div className={cls.balance_stt}>{sttBalance} STT</div>
                    <div className={cls.btns_block}>
                        <CustomButton onClick={sendTokens} type='button' classNameBtn={`${cls.btn_cash} ${cls.left}`}>
                            <div className={cls.text_in_btn}>
                                <div className={cls.add_money}>пополнить</div>
                            </div>
                        </CustomButton>
                        <CustomButton type='button' classNameBtn={`${cls.btn_cash} ${cls.right}`}>
                            <div className={cls.text_in_btn}>
                                <div>Вывести</div>
                            </div>
                        </CustomButton>
                    </div>
                </div>
            <div className={cls.input_block}>
                <CustomInput
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                    type='text' placeholder='0.00' classNameWrapper={cls.wrap_inp} classNameInput={cls.inp}/>
                <div className={cls.range}>Min 1,000 - 5, 467 STT</div>
            </div>
            <div className={cls.cover_btn_send_cover}>
                <CustomButton classNameBtn={cls.btn_send} type='button'>Подтвердить</CustomButton>
            </div>
        </div>
    );
};

export default IqPumpService;