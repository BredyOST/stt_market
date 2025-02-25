import React, { useEffect, useState } from 'react';
import cls from './donation.module.scss';
import CustomButton from '../../../shared/ui/сustomButton/CustomButton';
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import { useAppDispatch, useAppSelector } from '../../../shared/redux/hooks/hooks';
import { ReactComponent as SvgDonation } from '../../../assets/svg/donation.svg';
import CustomInput from '../../../shared/ui/customInput/customInput';
import { ethers } from 'ethers';

import CustomSelect from '../../../shared/ui/customSelect/customSelect';
import { LIST_DONATION, TOKEN_LIST } from '../../../shared/const/index.const';
import { authActions } from '../../../shared/redux/slices/authSlice/authSlice';
import { useAuthState, useModal } from '../../../shared/helpers/hooks';
import { walletActions } from '../../../shared/redux/slices/walletSlice/walletSlice';
import { DONAT_ADDRESS } from '../../../App';
import {
    exchangeContractAddress,
    sttAffiliateAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi, usdtContractAddress
} from "../../../shared/const/contracts";

const Donation = () => {
    const dispatch = useAppDispatch();

    /** STATES */
    const [transferTokens, setTransferTokens] = useState<string>(``);
    const [balance, setBalance] = useState<any>('0');
    const { provider, account } = useAppSelector((state) => state.authSlice);

    // const [targetToken, setTargetToken] = useState('stt')
    const [value, setValue] = useState(0.0);
    const [inputWidth, setInputWidth] = useState(3);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0.0);
    const [toastText, setToastText] = useState('');
    const [toastErrorShow, setToastErrorShow] = useState(false);
    const [toastCompleteShow, setToastCompleteShow] = useState(false);
    const [showWwModal, setWwModal] = useState(false);
    const { donationToken } = useAppSelector((state) => state.authSlice);
    const { successTransferTokens, sttBalance } = useAppSelector((state) => state.walletSlice);

    /** ACTIONS*/
    const { addSuccessTransferToken } = walletActions;

    const { addDonationToken } = authActions;
    const { addLoader } = authActions;

    /** управление модальными окнами*/
    const { closeModal } = useModal();
    /** изменение состояний authSlice*/
    const updateAuthState = useAuthState();

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalDonation = () => {
        closeModal('modalDonation');
    };

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue);

        if (number > +maxValue) {
            setTransferTokens(String(maxValue));
        } else if (inputValue.length === 0) {
            setTransferTokens('0');
        } else {
            setTransferTokens(inputValue);
        }
    };

    async function changeTargetToken(value: string): Promise<void> {
        try {
            const contract = new ethers.Contract(TOKEN_LIST[donationToken].contract, TOKEN_LIST[donationToken].abi, provider);
            const res = await contract.balanceOf(account);
            const balance: any = parseInt(String(Number(res) / Math.pow(10, TOKEN_LIST[donationToken].decimals)));
            setTransferTokens(`0`);
            setMaxValue(balance);
        } catch (err) {
            setMaxValue(0);
        }
    }

    async function makeDonation() {
        const token = TOKEN_LIST[donationToken];

        dispatch(addLoader(true));
        updateAuthState('textInfo', 'Preparing for the transaction.');

        const signer = await provider.getSigner();
        const contract = new ethers.Contract(token.contract, token.abi, signer);

        const decimals = await contract.decimals();
        const tokenAmount = ethers.parseUnits(transferTokens.toString(), parseInt(decimals));

        // Проверяем allowance (разрешение) перед approve
        const allowanceBefore = await contract.allowance(await signer.getAddress(), DONAT_ADDRESS);
        console.log('Allowance before approve:', allowanceBefore.toString());

        // Выполняем approve
        updateAuthState('textInfo', 'Approve transaction sent');
        const txApprove = await contract.approve(sttAffiliateAddress, tokenAmount);

        updateAuthState('textInfo', 'Waiting for approve transaction confirmation');
        console.log('Approve transaction sent:', txApprove.hash);
        const receiptApprove = await txApprove.wait();
        console.log('Approve transaction confirmed:', receiptApprove);

        // Проверяем allowance после approve
        const allowanceAfter = await contract.allowance(await signer.getAddress(), DONAT_ADDRESS);
        console.log('Allowance after approve:', allowanceAfter.toString());

        // Проверяем баланс подписанта
        const balance = await contract.balanceOf(await signer.getAddress());
        console.log('Balance:', balance.toString());

        try {
            updateAuthState('textInfo', 'Preparing donation transfer');

            const transferTx = await contract.transfer(DONAT_ADDRESS, tokenAmount);
            console.log('Transaction sent:', transferTx.hash);
            await transferTx.wait();

            updateAuthState('textInfo', 'Donation transaction confirmed');
            console.log('Transaction confirmed!');
        } catch (error) {
            console.error('Error sending tokens:', error);
        } finally {
            dispatch(addLoader(false));
            dispatch(addSuccessTransferToken(!successTransferTokens));
            closeModalDonation();
            updateAuthState('textInfo', null);
        }
    }

    function handleChange(e) {
        setValue(e.target.value);
        setInputWidth(e.target.value.length + 1);
    }

    /** Функция проверки баланса*/
    async function checkBalance() {
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

        let totalSt = 0.0;
        let totalUs = 0.0;
        // setBalance(balance.toString);
        const balance = await provider.getBalance(account);
        contract.totalSupply().then((res) => {
            totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2);
            usdtContract.balanceOf(exchangeContractAddress).then((res) => {
                totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2);
                contract.balanceOf(account).then((res) => {
                    let stBalance: any = parseFloat(String(Number(res) / Math.pow(10, 9) - 0.01)).toFixed(2);
                    if (+stBalance < 0) {
                        stBalance = 0.0;
                    }
                    let rate = totalUs / totalSt;
                    setBalance(stBalance);
                });
            });
        });
    }
    checkBalance();

    /** выбор токенов при swap*/
    const handleChooseDonationToken = (value: string) => {
        dispatch(addDonationToken(value));
        changeTargetToken(value);
    };

    /** для показа выпадающего меню swap блока*/
    const [isOpenDonationMenu, setIsOpenDonationMenu] = React.useState<boolean>(false);

    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenuDonation = () => {
        setIsOpenDonationMenu((prev) => !prev);
    };

    React.useEffect(() => {
        changeTargetToken('stt');
    }, [donationToken]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <CustomButton onClick={closeModalDonation} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg} />
                </CustomButton>
                <SvgDonation className={cls.svgDonation} />
                <div className={cls.title}>DONATION</div>
                <div className={cls.donation_text}>
                    The tokens that you transfer as donations go directly the smart contracts of the STT platform. This helps our community
                    to develop and ensures the growth of the token rate.
                </div>
            </div>
            <div className={cls.block_values}>
                <div className={cls.cover}>
                    <div className={cls.max}>
                        <div className={cls.count}>
                            <CustomInput
                                placeholder='0.00'
                                value={+transferTokens !== 0 ? transferTokens : ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokensForTransfer(e)}
                                type='text'
                                classNameWrapper={cls.wrap_input_tokens}
                                classNameInput={cls.input_cover_tokens}
                                style={{
                                    width: `${transferTokens?.length === 0 ? '4' : transferTokens?.length}ch`,
                                    minWidth: '4ch',
                                    maxWidth: '8ch',
                                }}
                            ></CustomInput>
                        </div>
                    </div>
                    {maxValue === 0 && <div className={cls.range}>you have 0</div>}
                    {maxValue >= 15 && <div className={cls.range}>15 - {maxValue}</div>}
                </div>
                <div className={cls.sttSign}>
                    <div className={cls.textStt}>
                        <CustomSelect
                            options={LIST_DONATION}
                            onSelect={handleChooseDonationToken}
                            isOpenMenu={isOpenDonationMenu}
                            handleOpenMenu={openMenuDonation}
                            chosenValue={donationToken}
                            arrowIndicator={false}
                            classNameWrapper={cls.wrapper_select}
                            classNameChosenValue={cls.custom_select}
                            classNameIcon={cls.icon_select}
                            classNameTextWithImage={cls.token_select}
                            classNameBodyList={cls.body_select}
                            classNameShowed={cls.show}
                            classNameActiveItem={cls.active}
                        />
                    </div>
                </div>
            </div>
            <div />
            <div className={cls.cover_btn}>
                <CustomButton onClick={makeDonation} type='button' classNameBtn={cls.btn_send_tokens}>
                    send
                </CustomButton>
            </div>
        </div>
    );
};

export default Donation;
