import React, {useEffect, useState} from 'react';
import cls from "./donation.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ReactComponent as SvgHurt} from '../../../assets/svg/hart.svg';
import CustomInput from "../../../shared/ui/customInput/customInput";
import {ethers} from "ethers";
import {
    exchangeContractAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress
} from "../../../helpers/contracts";
import CustomSelect from "../../../shared/ui/customSelect/customSelect";
import {FROM_OPTIONS, TO_OPTIONS, TOKEN_LIST} from "../../../shared/const/index.const";
import {SelectsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";
import {Button} from "react-bootstrap";

const Donation = () => {

    const dispatch = useAppDispatch()

    /** STATES */
    const [transferTokens, setTransferTokens] = useState<string>(``);
    const [balance, setBalance] = useState<any>('0');
    const {provider, account} = useAppSelector(state => state.authSlice)

    const [targetToken, setTargetToken] = useState('stt')
    const [value, setValue] = useState(0.000)
    const [inputWidth, setInputWidth] = useState(3)
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0.0)
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const [showWwModal, setWwModal] = useState(false)

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalDonation = () => {
        const modalDonation:any = 'modalDonation'
        dispatch(closeModal({modalName: modalDonation}))
    }

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(+e.target.value > +balance) {
            console.log('>>>')
            setTransferTokens(balance)
        } else {
            setTransferTokens(e.target.value)
        }
    }

    function changeTargetToken(dir) {
        setTargetToken(dir.value)
        setValue(0)
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const contract = new ethers.Contract(TOKEN_LIST[dir.value].contract, TOKEN_LIST[dir.value].abi, provider)
            contract.balanceOf(account).then((res) => {
                const balance:any = parseInt(String(Number(res) / Math.pow(10, TOKEN_LIST[dir.value].decimals)))
                setMaxValue(balance)
            })
        } else {
            setMaxValue(0)
        }

    }

    async function makeDonation() {
        const token = TOKEN_LIST[targetToken]
        console.log(token)
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(token.contract, token.abi, signer)
            const connectedContract:any = await contract.connect(signer)
            const sendValue = value * Math.pow(10, token.decimals)
            if (value > maxValue) {
                setToastText('Requested amount exceeds your balance')
                setToastErrorShow(true)
            }
            console.log(contract)
            console.log(sendValue)
            await connectedContract.transfer(token.target, sendValue.toString()).then((res) => {
                setToastCompleteShow(true)
            }).catch((error) => {
                console.log(error)
            });
        }
    }

    function handleChange(e) {
        setValue(e.target.value)
        setInputWidth(e.target.value.length + 1)

    }

    useEffect(() => {
        changeTargetToken({value: 'stt'})
    }, []);


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

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <CustomButton onClick={closeModalDonation} classnameWrapper={cls.wrapper_btn}
                              classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg}/>
                </CustomButton>
                <SvgHurt className={cls.hurt}/>
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
                                    style={{width: `${transferTokens?.length === 0 ? '4' : transferTokens?.length}ch`}}
                                >
                                </CustomInput>
                            </div>
                        </div>
                        <div className={cls.range}>15 - {balance}</div>
                    </div>
                    <div className={cls.sttSign}>
                        <div className={cls.textStt}>
                            <CustomSelect options={TO_OPTIONS['stt']}
                                          onSelect={changeTargetToken}
                                          indicator={SelectsIndicators.swapTo}
                                          arrowIndicator={false}

                            />
                        </div>
                    </div>
                </div>
            <div className={cls.cover_btn}>
                <Button className={cls.btn_send_tokens}>send</Button>
            </div>
            <div/>
        </div>
    );
};

export default Donation;