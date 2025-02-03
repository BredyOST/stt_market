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
    arbitrumCurrent,
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
import {EXTRA_TOKENS_INFO, FROM_OPTIONS, ICONS_TOKENS, to_list, TO_OPTIONS} from "../../../shared/const/index.const";
import {SelectsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";

const Swap = () => {

    const dispatch = useAppDispatch()

    /** STATES*/
    // const [sourceToken, setSourceToken] = useState('stt')
    // const [targetToken, setTargetToken] = useState('usdt')
    const [rate, setRate] = useState(0.0)
    const [correctRate, setCorrectRate] = useState(0.0)
    const [extraBalances, setExtraBalances] = useState({})
    const [sourceValue, setSourceValue] = useState(0.0)
    const [targetValue, setTargetValue] = useState(0.0)
    const [maxValue, setMaxValue] = useState(0.0)
    const [inputWidth, setInputWidth] = useState(3)
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const [preloader, setPreloader] = useState({display: 'none'})
    const [availableStt, setAvailableStt] = useState(0.0)
    const [availableUsdt, setAvailableUsdt] = useState(0.0)
    const [showWwModal, setWwModal] = useState(false)
    const [fee, setFee] = useState(100)

    const [swapTokens, setSwapTokens] = useState<string>(``);
    const {provider, account} = useAppSelector(state => state.authSlice)
    const [balance, setBalance] = useState<any>('0');
    const { targetToken, sourceToken } = useAppSelector((state) => state.authSlice);

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions

    /** FUNCTIONS*/

    /** для ввода токенов для обмена*/
    const setTokensForTransfer = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(+e.target.value > +balance) {
            setSwapTokens(balance)
        } else {
            setSwapTokens(e.target.value)
        }
    }

    /** для закрытия модального окна*/
    const closeModalSwap = () => {
        const modalSendTokens:any = 'modalSwap'
        dispatch(closeModal({modalName: modalSendTokens}))
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


    /** */
    function handleBalances() {
        if (account) {
            // const acc = account
            const providerMain = provider;
            // const provider_balance = new ethers.BrowserProvider(window.ethereum)
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

            // usdtContract.balanceOf(acc).then(res => {
            //     let walletUsdtBalance = (parseInt(parseFloat(Number(res) / Math.pow(10, 6)) * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',')
            //     setUsdtBalance(walletUsdtBalance)
            // })
            // provider_balance.getBalance(acc).then((balance) => {
            //     const balanceInEth = parseFloat(ethers.formatEther(balance)).toFixed(5).toString().replace('.', ',')
            //     setEthBalance(balanceInEth)
            // })
        }
    }

    function changeSourceToken(dir) {
        // setSourceToken(dir.value)
        setSourceValue(0)
        // setTargetToken(to_list[dir.value][0])
        setInputWidth(3)
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

    function changeTargetToken(dir) {
        // setTargetToken(dir.value)
        setSourceValue(0.0)
        setInputWidth(3)
        setTargetValue(0.0)
    }

    function handleChange(e) {
        const reqAmount = parseFloat(e.target.value)
        if (reqAmount > parseFloat(String(maxValue))) {
            setToastText('Requested amount exceeds your balance')
            setToastErrorShow(true)
        } else {
            setSourceValue(e.target.value)
            setInputWidth(e.target.value.toString().length + 1)
            if (!reqAmount) {
                setTargetValue(0.0)
            } else {
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
        }
    }

    function setMaxSource() {
        // const maxV = maxValue
        // setSourceValue(maxV)
        // setInputWidth(maxV.toString().length + 1)
        const e = {target: {value: balance}}
        handleChange(e)
    }

    function handleSwap() {
        if (window.ethereum) {
            if (sourceToken === 'stt') {
                if (sourceValue >= 1000) {
                    setPreloader({display: 'flex'})
                    if (targetToken === 'usdt') {
                        window.ethereum.request({method: "eth_chainId"}).then((result) => {
                            if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
                                const provider_balance = new ethers.BrowserProvider(window.ethereum)
                                provider_balance.listAccounts().then(async (result) => {
                                    const signer = await provider_balance.getSigner()
                                    const ExChangeContract = new ethers.Contract(exchangeContractAddress, exchangeContractAbi, signer)
                                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer)
                                    let amount = (sourceValue * Math.pow(10,9)).toString().toLocaleString()
                                    SttContract.approve(exchangeContractAddress, amount.toString()).then((res) => {
                                        setTimeout(function (){
                                            ExChangeContract.swap(amount.toString()).then(() => {
                                                setPreloader({display: 'none'})
                                                setTimeout(() => {
                                                    setToastCompleteShow(true)
                                                    setSourceValue(0)
                                                    setInputWidth(3)
                                                    setTargetValue(0)
                                                }, 100)
                                            }).catch((error) => {
                                                setPreloader({display: 'none'})
                                                console.log(error)
                                            });
                                        }, 1500)
                                    }).catch((error) => {
                                        setPreloader({display: 'none'})
                                        console.log(error)
                                    });
                                })
                            } else {
                                alert('Please, connect to Arbitrum Network')
                            }
                        })
                    } else {
                        window.ethereum.request({method: "eth_chainId"}).then((result) => {
                            if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
                                const provider_balance = new ethers.BrowserProvider(window.ethereum)
                                provider_balance.listAccounts().then(async (result) => {
                                    const signer = await provider_balance.getSigner()
                                    const AnyExChangeContract = new ethers.Contract(newExchangeAddress, newExchangeAbi, signer)
                                    const SttContract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer)
                                    let amount = (sourceValue * Math.pow(10,9)).toString().toLocaleString()
                                    SttContract.approve(newExchangeAddress, amount.toString()).then((res) => {
                                        setTimeout(function (){
                                            AnyExChangeContract.swap(extraBalances[targetToken].id, amount.toString()).then(() => {
                                                setPreloader({display: 'none'})
                                                setTimeout(() => {
                                                    setToastCompleteShow(true)
                                                    setSourceValue(0)
                                                    setInputWidth(3)
                                                    setTargetValue(0)
                                                }, 100)

                                            }).catch((error) => {
                                                setPreloader({display: 'none'})
                                                console.log(error)
                                            });
                                        }, 1500)
                                    }).catch((error) => {
                                        setPreloader({display: 'none'})
                                        console.log(error)
                                    });
                                })
                            } else {
                                alert('Please, connect to Arbitrum Network')
                            }
                        })
                    }
                }
            } else if (sourceToken === 'usdt') {
                if (targetToken === 'stt') {
                    if (sourceValue > 1) {
                        setPreloader({display: 'flex'})
                        window.ethereum.request({method: "eth_chainId"}).then((result) => {
                            if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
                                const provider_balance = new ethers.BrowserProvider(window.ethereum)
                                provider_balance.listAccounts().then(async (result) => {
                                    const signer = await provider_balance.getSigner()
                                    const UsdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, signer)
                                    const reverseExchangeContract = new ethers.Contract(reverseUsdtSttAddress, reverseUsdtSttAbi, signer)
                                    let amount = (sourceValue * (10**6)).toString().toLocaleString()
                                    UsdtContract.approve(reverseUsdtSttAddress, amount.toString()).then((res) => {
                                        setTimeout(function (){
                                            reverseExchangeContract.swap(amount.toString()).then(() => {
                                                setPreloader({display: 'none'})
                                                setTimeout(() => {
                                                    setToastCompleteShow(true)
                                                    setSourceValue(0)
                                                    setInputWidth(3)
                                                    setTargetValue(0)
                                                }, 100)
                                            }).catch((error) => {
                                                setPreloader({display: 'none'})
                                                console.log(error)
                                            });
                                        }, 1500)
                                    }).catch((error) => {
                                        setPreloader({display: 'none'})
                                        console.log(error)
                                    });
                                })
                            } else {
                                alert('Please, connect to Arbitrum Network')
                            }
                        })
                    } else {
                        setToastText('Requested amount less than minimal')
                        setToastErrorShow(true)
                    }
                }
            }
        }
    }

    useEffect(() => {
        handleBalances();
    }, [sourceToken]);


    const {addTargetToken, addSourceToken} = authActions;

    React.useEffect(() => {
        if (sourceToken === 'stt') {
            dispatch(addTargetToken('stt'));
        } else if (sourceToken === 'usdt') {
            dispatch(addTargetToken('usdt'));
        }
    }, [sourceToken]);


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
                                    style={{ width: `${swapTokens?.length === 0 ? '4' : swapTokens?.length}ch` }} // Исправлено здесь
                                >
                                </CustomInput>
                            </div>
                            <div>
                                <div onClick={setMaxSource} className={cls.countText}>max</div>
                            </div>
                        </div>
                        <div className={cls.range}>15 - {balance}</div>
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
                                    ? <div>1 STT
                                        = {rate ? (parseFloat(rate?.toString().replace(',', '.')) * (1 - (fee / 100))).toFixed(6) : 'Loading...'} USDT</div>
                                    : <>
                                        {targetToken.toLowerCase() === 'stt'
                                            ? <span>1 STT = {correctRate ? correctRate.toFixed(8) : 'Loading...'} USDT</span>
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
                <Button className={cls.btn_send_tokens}>swap</Button>
            </div>
        </div>
    );
};

export default Swap;