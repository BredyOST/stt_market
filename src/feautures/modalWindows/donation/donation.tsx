import React, {useEffect, useState} from 'react';
import cls from "./donation.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ReactComponent as SvgDonation} from '../../../assets/svg/donation.svg';
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
import {FROM_OPTIONS, LIST_DONATION, TO_OPTIONS, TOKEN_LIST} from "../../../shared/const/index.const";
import {SelectsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";
import {Button} from "react-bootstrap";
import {SwapOptionsFrom} from "../../../entities/others";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";

const Donation = () => {

    const dispatch = useAppDispatch()

    /** STATES */
    const [transferTokens, setTransferTokens] = useState<string>(``);
    const [balance, setBalance] = useState<any>('0');
    const {provider, account} = useAppSelector(state => state.authSlice)

    // const [targetToken, setTargetToken] = useState('stt')
    const [value, setValue] = useState(0.000)
    const [inputWidth, setInputWidth] = useState(3)
    const [minValue, setMinValue] = useState(0)
    const [maxValue, setMaxValue] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0.0)
    const [toastText, setToastText] = useState('')
    const [toastErrorShow, setToastErrorShow] = useState(false)
    const [toastCompleteShow, setToastCompleteShow] = useState(false)
    const [showWwModal, setWwModal] = useState(false)
    const {donationToken} = useAppSelector(state => state.authSlice)

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions
    const {addDonationToken} = authActions;

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalDonation = () => {
        const modalDonation:any = 'modalDonation'
        dispatch(closeModal({modalName: modalDonation}))
    }

    /** для ввода токенов для отправки*/
    const setTokensForTransfer = (e:React.ChangeEvent<HTMLInputElement>) => {

        const inputValue = e.target.value;
        // Проверка на допустимые символы (цифры и точка)
        const isValidInput = /^\d*\.?\d{0,3}$/.test(inputValue);

        if (!isValidInput) {
            return; // Если введены недопустимые символы, просто игнорируем
        }

        const number = parseFloat(inputValue)


        if(number > +maxValue) {
            setTransferTokens(String(maxValue))
        } else if (inputValue.length === 0) {
            setTransferTokens('0')
        } else {
            setTransferTokens(inputValue)
        }
    }

    async function changeTargetToken(value:string):Promise<void> {
        try {
            // setValue(0)
            const contract = new ethers.Contract(TOKEN_LIST[value].contract, TOKEN_LIST[value].abi, provider)
            const res = await contract.balanceOf(account);
            const balance:any = parseInt(String(Number(res) / Math.pow(10, TOKEN_LIST[value].decimals)))
            console.log('max balace')
            console.log(res)
            console.log(balance)
            setMaxValue(balance)
        } catch (err ){
            setMaxValue(0)

        }

        // if (window.ethereum) {
        //     const provider = new ethers.BrowserProvider(window.ethereum)
        //     const contract = new ethers.Contract(TOKEN_LIST[dir.value].contract, TOKEN_LIST[dir.value].abi, provider)
        //     contract.balanceOf(account).then((res) => {
        //         const balance:any = parseInt(String(Number(res) / Math.pow(10, TOKEN_LIST[dir.value].decimals)))
        //         setMaxValue(balance)
        //     })
        // } else {
        //     setMaxValue(0)
        // }

    }

    async function makeDonation() {
        const token = TOKEN_LIST[donationToken]

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

    // useEffect(() => {
    //     changeTargetToken('stt')
    // }, []);


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


    /** выбор токенов при swap*/
    const handleChooseDonationToken = (value: string) => {
        dispatch(addDonationToken(value))
        changeTargetToken(value)
    };

    /** для показа выпадающего меню swap блока*/
    const [isOpenDonationMenu, setIsOpenDonationMenu] = React.useState<boolean>(false);

    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenuDonation = () => {
        setIsOpenDonationMenu((prev) => !prev);
    };

    React.useEffect(() => {
        changeTargetToken('stt')
    },[donationToken])

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <CustomButton onClick={closeModalDonation} classnameWrapper={cls.wrapper_btn}
                              classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg}/>
                </CustomButton>
                {/*<div className={cls.cover_svg}>*/}
                {/*    <SvgHurt className={cls.hurt}/>*/}
                {/*</div>*/}
                <SvgDonation className={cls.svgDonation}/>
                <div className={cls.title}>DONATION</div>
                <div className={cls.donation_text}>The tokens that you transfer as
                    donations go directly the smart
                    contracts of the STT platform. This
                    helps our community to develop
                    and ensures the growth of the
                    token rate.</div>
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
                                        maxWidth: '8ch'
                                }}
                                >
                                </CustomInput>
                            </div>
                        </div>
                        {maxValue === 0 && <div className={cls.range}>you have 0</div>}
                        {maxValue >= 15 && <div className={cls.range}>15 - {maxValue}</div>}
                    </div>
                    <div className={cls.sttSign}>
                        <div className={cls.textStt}>
                            <CustomSelect options={LIST_DONATION}
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
            <div className={cls.cover_btn}>
                <Button className={cls.btn_send_tokens}>send</Button>
            </div>
            <div/>
        </div>
    );
};

export default Donation;