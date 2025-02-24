import React, { useEffect, useState } from 'react';
import cls from './swap.module.scss';
import CustomButton from '../../../shared/ui/сustomButton/CustomButton';
import CustomInput from '../../../shared/ui/customInput/customInput';
import { Button } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../../shared/redux/hooks/hooks';
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import { ReactComponent as SvgArrow } from '../../../assets/svg/arrow.svg';
import { ethers } from 'ethers';
import {
    exchangeContractAbi,
    exchangeContractAddress,
    extraTokenInfo,
    newExchangeAbi,
    newExchangeAddress,
    reverseUsdtSttAbi,
    reverseUsdtSttAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress,
} from '../../../shared/const/contracts';
import CustomSelect from '../../../shared/ui/customSelect/customSelect';
import { FROM_OPTIONS, TO_OPTIONS } from '../../../shared/const/index.const';
import { SelectsIndicators } from '../../../entities/uiInterfaces/uiInterfaces';
import { authActions } from '../../../shared/redux/slices/authSlice/authSlice';
import { showAttention } from '../../../shared/helpers/attention';
import { walletActions } from '../../../shared/redux/slices/walletSlice/walletSlice';
import { useAuthState, useModal } from '../../../shared/helpers/hooks';

const Swap = () => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const [rate, setRate] = React.useState(0.0);
    const [correctRate, setCorrectRate] = React.useState(0.0);
    const [extraBalances, setExtraBalances] = React.useState({});
    const [sourceValue, setSourceValue] = React.useState<string>('0');
    const [targetValue, setTargetValue] = React.useState(0.0);
    const [maxValue, setMaxValue] = React.useState(0.0);
    const [inputWidth, setInputWidth] = React.useState(3);
    const [preloader, setPreloader] = React.useState({ display: 'none' });
    const [availableStt, setAvailableStt] = React.useState(0.0);
    const [availableUsdt, setAvailableUsdt] = React.useState(0.0);
    const [fee, setFee] = React.useState(100);
    const [balance, setBalance] = React.useState<any>('0');

    const { provider, account } = useAppSelector((state) => state.authSlice);

    const { targetToken, sourceToken } = useAppSelector((state) => state.authSlice);
    const { sttBalance, successSwap } = useAppSelector((state) => state.walletSlice);

    /** управление модальными окнами*/
    const { closeModal } = useModal();
    /** изменение состояний authSlice*/
    const updateAuthState = useAuthState();

    /** ACTIONS*/
    const { addTargetToken, addSourceToken } = authActions;
    const { addLoader } = authActions;
    const { addSuccessSwap } = walletActions;

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSwap = () => {
        closeModal('modalSwap');
    };

    /** Функция проверки баланса*/
    async function checkBalance() {
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

        let totalSt = 0.0;
        let totalUs = 0.0;
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

    React.useEffect(() => {
        checkBalance();
    }, [account]);

    /** */
    async function handleBalances() {
        if (account) {
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

            let totalSt = 0.0;
            let totalUs = 0.0;
            let fullSt = 0.0;
            let fullUs = 0.0;
            const ExChangeContract = new ethers.Contract(exchangeContractAddress, exchangeContractAbi, provider);
            let feeView = 0.0;

            const result = await ExChangeContract.fee();
            feeView = Number(result) / 100;
            setFee(feeView);

            const totalSupplyResult = await contract.totalSupply();
            totalSt = +(Number(totalSupplyResult) / Math.pow(10, 9)).toFixed(2);
            fullSt = Number(totalSupplyResult) / Math.pow(10, 9);
            const usdtContractResult = await usdtContract.balanceOf(exchangeContractAddress);
            totalUs = +(Number(usdtContractResult) / Math.pow(10, 6)).toFixed(2);
            fullUs = Number(usdtContractResult) / Math.pow(10, 6);
            const newExchangeContract = new ethers.Contract(newExchangeAddress, newExchangeAbi, provider);

            let extraTokens = {};

            for (const con in extraTokenInfo) {
                const tokenContract = new ethers.Contract(extraTokenInfo[con].contract, extraTokenInfo[con].abi, provider);
                const tokenContractResult = await tokenContract.balanceOf(newExchangeAddress);
                let tokenBalance = Number(tokenContractResult) / Math.pow(10, extraTokenInfo[con].decimals);
                extraTokens[con] = {
                    id: extraTokenInfo[con].id,
                    name: extraTokenInfo[con].label,
                    icon: extraTokenInfo[con].icon,
                    balance: parseFloat(tokenBalance.toFixed(14)),
                    rate: (tokenBalance / totalSt).toFixed(14),
                    enabled: false,
                };
                const newExchangeContractResult = await newExchangeContract.getPrice(extraTokenInfo[con].id);
                if (Number(newExchangeContractResult) > 0) {
                    extraTokens[con]['enabled'] = true;
                }
            }
            setExtraBalances(extraTokens);

            const resutBalance = await contract.balanceOf(account);
            let stBalance = parseFloat((Number(resutBalance) / Math.pow(10, 9) - 0.01).toFixed(2));

            if (stBalance < 0) {
                stBalance = 0.0;
            }
            /** расчет курса обмена:*/
            let rate = totalUs / totalSt;

            // console.log(parseFloat(rate.toFixed(7)).toString().replace('.', ','))

            let usBalance = parseInt(String(parseFloat(String(rate * stBalance)) * 100)) / 100;

            setMaxValue(stBalance);

            setRate(+parseFloat(rate.toFixed(7)).toString());
            const reverseExchangeContract = new ethers.Contract(reverseUsdtSttAddress, reverseUsdtSttAbi, provider);
            const sttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            /** Получение коэффициента и корректировка курса */
            const reverseExchangeContractResult = await reverseExchangeContract.factor();
            let totalSupplyView = parseFloat(totalSt.toString().replace(/ /g, '').replace(',', '.'));
            let contractBalanceView = parseFloat(totalUs.toString().replace(/ /g, '').replace(',', '.'));
            let factor = parseFloat(String(Number(reverseExchangeContractResult) / Math.pow(10, 18)));
            let fee = 1 - feeView / 100;
            let correctRateView = 1 / ((totalSupplyView / contractBalanceView) * factor * fee);
            setCorrectRate(correctRateView);

            const sttContractResult = await sttContract.balanceOf(reverseUsdtSttAddress);
            let available = (parseFloat(String(Number(sttContractResult) / Math.pow(10, 9))) - 0.01).toFixed(2);
            let availableUsdtView = parseFloat(available) * parseFloat(String(rate));
            setAvailableStt(+available);
            setAvailableUsdt(availableUsdtView);
        }
    }

    async function changeSourceToken() {
        setSourceValue('0');
        setTargetValue(0.0);

        const signer = await provider.getSigner();
        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
        const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, signer);

        if (sourceToken.toLowerCase() == 'stt') {
            const balance = await provider.getBalance(account);

            contractCommon.balanceOf(account).then((res) => {
                let balance = parseFloat((Number(res) / Math.pow(10, 9) - 0.01).toFixed(2));

                if (balance < 0) {
                    balance = 0.0;
                }
                setMaxValue(balance);
            });
        } else {
            usdtContract.balanceOf(account).then((res) => {
                let balance = parseFloat((Number(res) / Math.pow(10, 6) - 0.01).toFixed(2));
                if (balance < 0) {
                    balance = 0;
                }
                setMaxValue(balance);
            });
        }
    }

    function changeTargetToken() {
        setSourceValue('0');
        setTargetValue(0.0);
    }

    function handleChange(e) {
        const inputValue = e.target.value;

        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue);

        if (number > parseFloat(String(maxValue))) {
            // showAttention(`Please check the entered ERC20 account.`, 'error')
            setSourceValue(String(maxValue));
            setTarget(inputValue);
        } else {
            setSourceValue(inputValue);
            setInputWidth(inputValue.length + 1);
            if (!number) {
                setTargetValue(0.0);
            } else {
                setTarget(inputValue);
            }
        }
    }

    /** для проверки конечного значения после конвертации токена*/
    function setTarget(reqAmount) {
        if (sourceToken?.toLowerCase() === 'stt') {
            if (targetToken?.toLowerCase() === 'usdt') {
                const rateV = parseFloat(rate.toString().replace(',', '.')) * (1 - fee / 100);
                let tValue = +(reqAmount * rateV).toFixed(4);
                setTargetValue(tValue);
            } else {
                const rateV = parseFloat(extraBalances[targetToken?.toLowerCase()].rate.replace(',', '.')) * (1 - fee / 100);
                let tValue = +(reqAmount * rateV).toFixed(4);
                setTargetValue(tValue);
            }
        } else if (sourceToken?.toLowerCase() === 'usdt') {
            if (targetToken?.toLowerCase() === 'stt') {
                let tValue = +(reqAmount / +correctRate.toFixed(8)).toFixed(2);
                setTargetValue(tValue);
            }
        } else if (sourceToken?.toLowerCase() === 'usdt') {
            setTargetValue(0.0);
        }
    }

    function setMaxSource() {
        // const maxV = maxValue
        // setSourceValue(maxV)
        // setInputWidth(maxV.toString().length + 1)
        const e = { target: { value: maxValue } };
        handleChange(e);
    }

    async function handleSwap() {
        try {
            const signer = await provider.getSigner();

            dispatch(addLoader(true));

            updateAuthState('textInfo', 'Preparing swap transaction...');

            if (sourceToken?.toLowerCase() === 'stt') {
                if (parseFloat(sourceValue) < 1000) {
                    showAttention(`Minimum amount for STT swap is 1000`, 'error');
                    return;
                }

                const amount = ethers.parseUnits(sourceValue.toString(), 9);

                if (targetToken?.toLowerCase() === 'usdt') {
                    const ExChangeContract = new ethers.Contract(exchangeContractAddress, exchangeContractAbi, signer);
                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);

                    // Вызываем approve
                    updateAuthState('textInfo', 'Approving token transfer...');
                    const approveTx = await SttContract.approve(exchangeContractAddress, amount);
                    updateAuthState('textInfo', 'Waiting for approval confirmation...');
                    await approveTx.wait();

                    // Вызываем swap
                    updateAuthState('textInfo', 'Approval confirmed. Executing swap...');
                    const swapTx = await ExChangeContract.swap(amount);
                    updateAuthState('textInfo', 'Swap transaction sent. Waiting for confirmation...');
                    await swapTx.wait();
                    updateAuthState('textInfo', 'Swap completed successfully!');
                    showAttention(`Swap completed`, 'success');
                } else {
                    const AnyExChangeContract = new ethers.Contract(newExchangeAddress, newExchangeAbi, signer);
                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
                    // Вызываем approve
                    updateAuthState('textInfo', 'Approving token transfer...');
                    const approveTx = await SttContract.approve(newExchangeAddress, amount);
                    updateAuthState('textInfo', 'Approval confirmed. Executing swap...');
                    updateAuthState('textInfo', 'Approval confirmed. Executing swap...');
                    await approveTx.wait();

                    // Вызываем swap
                    updateAuthState('textInfo', 'Approval confirmed. Executing swap...');
                    const swapTx = await AnyExChangeContract.swap(extraBalances[targetToken?.toLowerCase()]?.id, amount);
                    updateAuthState('textInfo', 'Swap transaction sent. Waiting for confirmation...');
                    await swapTx.wait();
                    showAttention(`Swap completed`, 'success');
                }
            } else if (sourceToken?.toLowerCase() === 'usdt' && targetToken === 'stt') {
                if (parseFloat(sourceValue) <= 1) {
                    showAttention(`Requested amount less than minimal`, 'error');
                    return;
                }
                updateAuthState('textInfo', 'Preparing swap transaction...');
                const amount = ethers.parseUnits(sourceValue.toString(), 6); // 6 decimals для USDT

                const reverseExchangeContract = new ethers.Contract(reverseUsdtSttAddress, reverseUsdtSttAbi, signer);
                const UsdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, signer);

                // Вызываем approve
                updateAuthState('textInfo', 'Approving token transfer...');
                const approveTx = await UsdtContract.approve(reverseUsdtSttAddress, amount);
                await approveTx.wait();

                // Вызываем swap
                updateAuthState('textInfo', 'Approval confirmed. Executing swap...');
                const swapTx = await reverseExchangeContract.swap(amount);
                updateAuthState('textInfo', 'Swap transaction sent. Waiting for confirmation...');
                await swapTx.wait();

                console.log('Swap completed!');
                showAttention(`Swap completed`, 'success');
            }
            setPreloader({ display: 'none' });
            setSourceValue('0');
            setTargetValue(0);
        } catch (error) {
            console.error('Error during swap:', error);
            showAttention(`Error during swap. Please try again`, 'error');
        } finally {
            dispatch(addLoader(false));
            updateAuthState('textInfo', null);
            dispatch(addSuccessSwap(!successSwap));
        }
    }

    useEffect(() => {
        handleBalances();
    }, []);

    React.useEffect(() => {
        if (sourceToken === 'stt') {
            dispatch(addTargetToken('stt'));
        } else if (sourceToken === 'usdt') {
            dispatch(addTargetToken('usdt'));
        }
        changeTargetToken();
        changeSourceToken();
    }, [sourceToken]);

    React.useEffect(() => {
        const e = { target: { value: sourceValue } };
        handleChange(e);
    }, [targetToken]);

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={cls.notification_header}>SWAP</div>
                <CustomButton onClick={closeModalSwap} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg} />
                </CustomButton>
            </div>
            <div className={cls.cover_text_block}>
                <div className={cls.valueBlock}>
                    <div className={cls.cover}>
                        <div className={cls.max}>
                            <div className={cls.count}>
                                <CustomInput
                                    placeholder='0.00'
                                    value={sourceValue == '0' ? '' : sourceValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    type='text'
                                    classNameWrapper={cls.wrap_input_tokens}
                                    classNameInput={cls.input_cover_tokens}
                                    style={{ width: `${sourceValue?.toString()?.length === 0 ? '4' : sourceValue?.toString()?.length}ch` }}
                                ></CustomInput>
                            </div>
                            <div>
                                <div onClick={setMaxSource} className={cls.countText}>
                                    max
                                </div>
                            </div>
                        </div>
                        {sourceToken.toLowerCase() === 'usdt' && targetToken.toLowerCase() === 'stt' && (
                            <div className={cls.range}>
                                {numberWithCommas(availableStt)} ~ {numberWithCommas(availableUsdt.toFixed(2))} USDT
                            </div>
                        )}

                        {sourceToken.toLowerCase() === 'stt' && <div className={cls.range}>15 - {sttBalance}</div>}
                    </div>
                    <div className={cls.sttSign}>
                        <div className={cls.textStt}>
                            <CustomSelect
                                options={FROM_OPTIONS}
                                // onSelect={changeSourceToken}
                                indicator={SelectsIndicators.swapFrom}
                                arrowIndicator={false}
                            />
                        </div>
                    </div>
                </div>
                <div className={cls.changeBlock}>
                    <div className={cls.blockInfo}>
                        <div className={cls.convertValue}>{targetToken.toLowerCase() === 'eth' ? '0.00' : targetValue}</div>
                        <div className={cls.sttSign}>
                            <div className={cls.textStt}>
                                <CustomSelect
                                    options={TO_OPTIONS[sourceToken.toLowerCase()]}
                                    onSelect={changeTargetToken}
                                    indicator={SelectsIndicators.swapTo}
                                    arrowIndicator={false}
                                />
                            </div>
                        </div>
                    </div>
                    {targetToken.toLowerCase() !== 'eth' ? (
                        <>
                            <div className={cls.infoSwap}>
                                <h3>Swap rate</h3>
                                {targetToken.toLowerCase() === 'usdt' ? (
                                    <div>
                                        1 STT = {rate ? (parseFloat(rate?.toString().replace(',', '.')) * (1 - fee / 100)).toFixed(6) : 0.0}{' '}
                                        USDT
                                    </div>
                                ) : (
                                    <>
                                        {targetToken.toLowerCase() === 'stt' ? (
                                            <span>1 stt = {correctRate && !isNaN(correctRate) ? correctRate.toFixed(8) : 0.0} USDT</span>
                                        ) : extraBalances[targetToken.toLowerCase()] ? (
                                            <span>
                                                1 STT = {extraBalances[targetToken.toLowerCase()]?.rate}{' '}
                                                {extraBalances[targetToken.toLowerCase()]?.name}
                                            </span>
                                        ) : (
                                            <span>0.00</span>
                                        )}
                                    </>
                                )}
                                <span className={cls.green_swap}>Update 12:15 GMT</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <div className={cls.swap_block_action}>
                                    <div className={cls.info_block}>
                                        <span>To swap</span>
                                        <span>USDT to ETH go to</span>
                                        <a
                                            className={cls.green_swap}
                                            href={
                                                'https://www.sushi.com/swap?chainId=42161&token0=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&token1=NATIVE'
                                            }
                                            target={'_blank'}
                                            rel={'noreferrer'}
                                        >
                                            Sushi.com
                                        </a>
                                    </div>
                                    <div className={cls.green_swap}>
                                        <a
                                            className={cls.green_swap}
                                            href={
                                                'https://www.sushi.com/swap?chainId=42161&token0=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&token1=NATIVE'
                                            }
                                            target={'_blank'}
                                            rel={'noreferrer'}
                                        ></a>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className={cls.arrow}>
                    <div className={cls.arrowCover}>
                        <SvgArrow className={cls.svgArrow} />
                    </div>
                </div>
            </div>
            <div className={cls.coverBlockMoney}>
                <Button onClick={handleSwap} className={cls.btn_send_tokens}>
                    swap
                </Button>
            </div>
        </div>
    );
};

export default Swap;
