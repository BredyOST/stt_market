import React, {useEffect, useState} from 'react';
import cls from "./swap.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import CustomInput from "../../../shared/ui/customInput/customInput";
import {Button} from "react-bootstrap";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {ReactComponent as SvgArrow} from '../../../assets/svg/arrow.svg';
import {ethers} from "ethers";
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
    usdtContractAddress
} from "../../../helpers/contracts";
import CustomSelect from "../../../shared/ui/customSelect/customSelect";
import { FROM_OPTIONS, TO_OPTIONS} from "../../../shared/const/index.const";
import {SelectsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";
import {showAttention} from "../../../shared/helpers/attention";
import {walletActions} from "../../../shared/redux/slices/walletSlice/walletSlice";
import {IModalWindowStatesSchema} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";

const Swap = () => {

    const dispatch = useAppDispatch()

    /** STATES*/
    const [rate, setRate] = useState(0.0)
    const [correctRate, setCorrectRate] = useState(0.0)
    const [extraBalances, setExtraBalances] = useState({})
    const [sourceValue, setSourceValue] = useState(0.0)
    const [targetValue, setTargetValue] = useState(0.0)
    const [maxValue, setMaxValue] = useState(0.0)
    const [inputWidth, setInputWidth] = useState(3)
    const [preloader, setPreloader] = useState({display: 'none'})
    const [availableStt, setAvailableStt] = useState(0.0)
    const [availableUsdt, setAvailableUsdt] = useState(0.0)
    const [fee, setFee] = useState(100)

    const [swapTokens, setSwapTokens] = useState<string>(``);
    const {provider, account} = useAppSelector(state => state.authSlice)
    const [balance, setBalance] = useState<any>('0');

    const { targetToken, sourceToken } = useAppSelector((state) => state.authSlice);
    const { sttBalance, successSwap} = useAppSelector(state => state.walletSlice)


    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions
    const {addTargetToken, addSourceToken} = authActions;
    const {addLoader} = authActions;
    const {addSuccessSwap} = walletActions;


    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSwap = () => {
        const modalSendTokens:string = 'modalSwap'
        dispatch(closeModal({modalName: modalSendTokens as keyof IModalWindowStatesSchema}))
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

    React.useEffect(() => {
        checkBalance();
    }, [account]);

    /** */
    function handleBalances() {
        if (account) {
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);
            let totalSt = 0.0
            let totalUs = 0.0
            let fullSt = 0.0
            let fullUs = 0.0
            const ExChangeContract = new ethers.Contract(exchangeContractAddress, exchangeContractAbi, provider)
            let feeView = 0.0
            ExChangeContract.fee().then(res => {
                feeView = Number(res) / 100
                setFee(feeView)
                contract.totalSupply().then(res => {
                    totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
                    fullSt = Number(res) / Math.pow(10, 9)
                })
                usdtContract.balanceOf(exchangeContractAddress).then(res => {
                    totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2)
                    fullUs = Number(res) / Math.pow(10, 6)
                })
                const newExchangeContract = new ethers.Contract(newExchangeAddress, newExchangeAbi, provider)
                let extraTokens = {}
                for (const con in extraTokenInfo) {
                    const tokenContract = new ethers.Contract(extraTokenInfo[con].contract, extraTokenInfo[con].abi, provider)
                    tokenContract.balanceOf(newExchangeAddress).then(res => {
                        let tokenBalance = Number(res) / Math.pow(10, extraTokenInfo[con].decimals)
                        extraTokens[con] = {id: extraTokenInfo[con].id, name: extraTokenInfo[con].label, icon: extraTokenInfo[con].icon, balance: parseFloat(tokenBalance.toFixed(14)), rate: ((tokenBalance / totalSt).toFixed(14)), enabled: false}
                        newExchangeContract.getPrice(extraTokenInfo[con].id).then(result => {
                            if (Number(result) > 0) {
                                extraTokens[con]['enabled'] = true
                            }
                        })
                    })
                }

                setExtraBalances(extraTokens)
                contract.balanceOf(account).then(res => {
                    let stBalance = parseFloat(((Number(res) / Math.pow(10, 9)) - 0.01).toFixed(2));

                    if (stBalance < 0) {
                        stBalance = 0.0
                    }
                    let rate = totalUs / totalSt

                    let usBalance = (parseInt(String(parseFloat((String(rate * stBalance))) * 100)) /100)
                    setMaxValue(stBalance)
                    setRate(+parseFloat(rate.toFixed(7)).toString().replace('.', ','))
                    const reverseExchangeContract = new ethers.Contract(reverseUsdtSttAddress, reverseUsdtSttAbi, provider)
                    const sttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
                    reverseExchangeContract.factor().then((res) => {
                        let totalSupplyView = parseFloat(totalSt.toString().replace(/ /g, '').replace(',', '.'))
                        let contractBalanceView = parseFloat(totalUs.toString().replace(/ /g, '').replace(',', '.'))
                        let factor = parseFloat(String(Number(res) / Math.pow(10,18)))
                        let fee = 1 - (feeView / 100)
                        let correctRateView = (1 / (totalSupplyView / contractBalanceView * factor * fee))
                        setCorrectRate(correctRateView)
                    })
                    sttContract.balanceOf(reverseUsdtSttAddress).then((res) => {
                        let available = (parseFloat(String(Number(res) / Math.pow(10, 9))) - 0.01).toFixed(2)
                        let availableUsdtView = parseFloat(available) * parseFloat(String(rate))
                        setAvailableStt(+available)
                        setAvailableUsdt(availableUsdtView)
                    })
                })
            })

            // usdtContract.balanceOf(account).then(res => {
            //     let walletUsdtBalance = (parseInt(parseFloat(Number(res) / Math.pow(10, 6)) * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',')
            //     setUsdtBalance(walletUsdtBalance)
            // })
            // provider_balance.getBalance(account).then((balance) => {
            //     const balanceInEth = parseFloat(ethers.formatEther(balance)).toFixed(5).toString().replace('.', ',')
            //     setEthBalance(balanceInEth)
            // })
        }
    }

    function changeSourceToken(dir) {
        // setSourceToken(dir.value)
        setSourceValue(0)
        // setTargetToken(to_list[dir.value][0])
        // setInputWidth(3)
        setTargetValue(0.0)
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            if (dir.value === 'stt') {
                const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider)
                contract.balanceOf(account).then((res) => {
                    let balance = parseFloat(((Number(res) / Math.pow(10, 9)) - 0.01).toFixed(2));

                    if (balance < 0) {
                        balance = 0.0
                    }
                    setMaxValue(balance)
                })
            } else {
                const contract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider)
                contract.balanceOf(account).then((res) => {
                    let balance = parseFloat(((Number(res) / Math.pow(10, 6)) - 0.01).toFixed(2));
                    if (account === '0xF8e758385e12391aeA3a5aB342D5F377D7c41497') {
                        balance = 123.62
                    }
                    if (balance < 0) {
                        balance = 0.0
                    }
                    setMaxValue(balance)
                })
            }
        } else {
            setMaxValue(0)
        }
    }

    function changeTargetToken() {
        setSourceValue(0.0)
        setTargetValue(0.0)
    }

    function handleChange(e) {
        const reqAmount = parseFloat(e.target.value)
        if (reqAmount > parseFloat(String(maxValue))) {
            // showAttention(`Please check the entered ERC20 account.`, 'error')
            setSourceValue(balance)
        } else {
            setSourceValue(e.target.value)
            setInputWidth(e.target.value.toString().length + 1)
            if (!reqAmount) {
                setTargetValue(0.0)
            } else {
                setTarget(reqAmount)
            }
        }
    }

    /** для проверки конечного значения после конвертации токена*/
    function setTarget(reqAmount) {
        if (sourceToken?.toLowerCase() === 'stt') {
            if (targetToken?.toLowerCase() === 'usdt') {
                const rateV = parseFloat(rate.toString().replace(',', '.')) * (1 - (fee / 100))
                let tValue = +(reqAmount * rateV).toFixed(4)
                setTargetValue(tValue)
            } else {
                const rateV = parseFloat(extraBalances[targetToken?.toLowerCase()].rate.replace(',', '.')) * (1 - (fee / 100))
                let tValue = +(reqAmount * rateV).toFixed(4)
                setTargetValue(tValue)
            }
        } else if (sourceToken?.toLowerCase() === 'usdt') {
            if (targetToken?.toLowerCase() === 'stt') {
                let tValue = +(reqAmount / +correctRate.toFixed(8)).toFixed(2)
                setTargetValue(tValue)
            }
        }
    }

    function setMaxSource() {
        // const maxV = maxValue
        // setSourceValue(maxV)
        // setInputWidth(maxV.toString().length + 1)
        const e = {target: {value: balance}}
        handleChange(e)
    }

    async function handleSwap() {

        try {
            const signer = await provider.getSigner(); // Получаем signer через AppKit
            dispatch(addLoader(true))
            if (sourceToken?.toLowerCase() === 'stt') {
                if (sourceValue < 1000) {
                    showAttention(`Minimum amount for STT swap is 1000`, 'error')
                    return;
                }

                const amount = ethers.parseUnits(sourceValue.toString(), 9);

                if (targetToken?.toLowerCase() === 'usdt') {
                    const ExChangeContract = new ethers.Contract(exchangeContractAddress, exchangeContractAbi, signer);
                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);

                    // Вызываем approve
                    const approveTx = await SttContract.approve(exchangeContractAddress, amount);
                    await approveTx.wait();

                    // Вызываем swap
                    const swapTx = await ExChangeContract.swap(amount);
                    await swapTx.wait();

                    showAttention(`Swap completed`, 'success')

                } else {
                    const AnyExChangeContract = new ethers.Contract(newExchangeAddress, newExchangeAbi, signer);
                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
                    // Вызываем approve
                    const approveTx = await SttContract.approve(newExchangeAddress, amount);
                    await approveTx.wait();

                    // Вызываем swap
                    const swapTx = await AnyExChangeContract.swap(extraBalances[targetToken?.toLowerCase()]?.id, amount);
                    await swapTx.wait();

                    showAttention(`Swap completed`, 'success')

                }
            } else if (sourceToken?.toLowerCase() === 'usdt' && targetToken === 'stt') {
                if (sourceValue <= 1) {
                    showAttention(`Requested amount less than minimal`, 'error')
                    return;
                }

                const amount = ethers.parseUnits(sourceValue.toString(), 6); // 6 decimals для USDT

                const reverseExchangeContract = new ethers.Contract(reverseUsdtSttAddress, reverseUsdtSttAbi, signer);
                const UsdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, signer);

                // Вызываем approve
                const approveTx = await UsdtContract.approve(reverseUsdtSttAddress, amount);
                await approveTx.wait();

                // Вызываем swap
                const swapTx = await reverseExchangeContract.swap(amount);
                await swapTx.wait();

                console.log("Swap completed!");
                showAttention(`Swap completed`, 'success')

            }

            setPreloader({ display: 'none' });
            setSourceValue(0);
            setTargetValue(0);
        } catch (error) {
            console.error("Error during swap:", error);
            showAttention(`Error during swap. Please try again`, 'error')

        } finally {
            dispatch(addLoader(false))
            dispatch(addSuccessSwap(!successSwap))
        }
    }

    useEffect(() => {
        handleBalances();
    }, [sourceToken]);

    React.useEffect(() => {
        if (sourceToken === 'stt') {
            dispatch(addTargetToken('stt'));
        } else if (sourceToken === 'usdt') {
            dispatch(addTargetToken('usdt'));
        }
    }, [sourceToken]);

    React.useEffect(() => {
        changeTargetToken()
    },[sourceToken]);

    React.useEffect(() => {
        const e = {target: {value: sourceValue}}
        handleChange(e)
    },[targetToken]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={cls.notification_header}>SWAP</div>
                <CustomButton onClick={closeModalSwap} classnameWrapper={cls.wrapper_btn}
                              classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg}/>
                </CustomButton>
            </div>
            <div className={cls.cover_text_block}>
                <div className={cls.valueBlock}>
                    <div className={cls.cover}>
                        <div className={cls.max}>
                            <div className={cls.count}>
                                <CustomInput
                                    placeholder='0.00'
                                    value={sourceValue !== 0 ? sourceValue : ''}
                                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    type='text'
                                    classNameWrapper={cls.wrap_input_tokens}
                                    classNameInput={cls.input_cover_tokens}
                                    style={{ width: `${sourceValue?.toString()?.length === 0 ? '4' : sourceValue?.toString()?.length}ch` }}
                                >
                                </CustomInput>
                            </div>
                            <div>
                                <div onClick={setMaxSource} className={cls.countText}>max</div>
                            </div>
                        </div>
                        <div className={cls.range}>15 - {sttBalance}</div>
                    </div>
                    <div className={cls.sttSign}>
                        <div className={cls.textStt}>
                            <CustomSelect options={FROM_OPTIONS}
                                          onSelect={changeSourceToken}
                                          indicator={SelectsIndicators.swapFrom}
                                          arrowIndicator={false}

                            />
                        </div>
                    </div>
                </div>
                <div className={cls.changeBlock}>
                    <div className={cls.blockInfo}>
                    <div className={cls.convertValue}>{targetValue}</div>
                        <div className={cls.sttSign}>
                            <div className={cls.textStt}>
                                <CustomSelect options={TO_OPTIONS[sourceToken.toLowerCase()]}
                                              onSelect={changeTargetToken}
                                              indicator={SelectsIndicators.swapTo}
                                              arrowIndicator={false}

                                />
                            </div>
                        </div>
                    </div>
                    {targetToken !== 'eth'
                        ? <>
                            <div className={cls.infoSwap}>
                                <h3>Swap rate</h3>
                                {targetToken.toUpperCase() === 'USDT'
                                    ? <div>1 STT = {rate ? (parseFloat(rate?.toString().replace(',', '.')) * (1 - (fee / 100))).toFixed(6) : 'Loading...'} USDT</div>
                                    : <>
                                        {targetToken.toLowerCase() === 'stt'
                                                ? <span>1 STT = {correctRate && !isNaN(correctRate) ? correctRate.toFixed(8) : 'Loading...'} USDT</span>
                                                : extraBalances[targetToken.toLowerCase()] ? (
                                                <span>
                                                        1 STT = {extraBalances[targetToken.toLowerCase()]?.rate} {extraBalances[targetToken.toLowerCase()]?.name}

                                                    </span>
                                            ) : (
                                                <span>Loading...</span>
                                            )
                                        }
                                    </>
                                }
                                <span className={"green-span"}>Update 12:15 GMT</span>
                            </div>
                        </>
                        : <>
                            <div>
                                <div className={"swap_block-action"}>
                                    <div className={"info-block"}>
                                        <span>To swap</span>
                                        <span>USDT to ETH go to</span>
                                        <a className={"green-span"}
                                           href={"https://www.sushi.com/swap?chainId=42161&token0=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&token1=NATIVE"}
                                           target={"_blank"} rel={"noreferrer"}>Sushi.com</a>
                                    </div>
                                    <div className={"swap__confirm"}>
                                        <a className={"swap__confirm-button _link"}
                                           href={"https://www.sushi.com/swap?chainId=42161&token0=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&token1=NATIVE"}
                                           target={"_blank"} rel={"noreferrer"}>
                                            go
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
                <div className={cls.arrow}>
                    <div className={cls.arrowCover}>
                        <SvgArrow className={cls.svgArrow}/>
                    </div>
                </div>
            </div>
            <div className={cls.coverBlockMoney}>
                <Button onClick={handleSwap} className={cls.btn_send_tokens}>swap</Button>
            </div>
        </div>
    );
};

export default Swap;