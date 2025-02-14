import React, {useState} from 'react';
import cls from "./sttBonus.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useAppDispatch, useAppSelector} from "../../../shared/redux/hooks/hooks";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {ReactComponent as SvgGift} from '../../../assets/svg/gift_.svg';
import CustomInput from "../../../shared/ui/customInput/customInput";
import {ForFunc} from "../../../entities/others";
import {IModalWindowStatesSchema} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {ethers} from "ethers";
import {
    sttAffiliateAddress,
    tokenContractAbiCb31,
} from "../../../helpers/contracts";
import {showAttention} from "../../../shared/helpers/attention";
import {authActions} from "../../../shared/redux/slices/authSlice/authSlice";
import {ReactComponent as SvgQr} from '../../../assets/svg/qr.svg';


const SttBonusWindow = () => {

    const dispatch = useAppDispatch()

    /** states */
    const {provider, account} = useAppSelector(state => state.authSlice)
    const [ERCUpliner, setERCUpliner] = useState<string>('')
    const {hasUpliner} = useAppSelector(state => state.authSlice)
    const [validateAddress, setValidateAddress] = useState<boolean>(false)
    const [hasUplinerForInvitedAdress, setHasUplinerForInvitedAdress] = useState<boolean>(false)
    const deferredAddress = React.useDeferredValue(ERCUpliner)

    /** actions*/
    const {closeModal, openModal} = modalAddProfileActions
    const {addLoader, addHasUpliner} = authActions;

    /** для закрытия модального окна*/
    const closeModalSttBonus:ForFunc<void, void> = () => {
        const modalSttBonus:string = 'modalSttBonus'
        dispatch(closeModal({modalName: modalSttBonus as keyof IModalWindowStatesSchema}))
    }

    /** функция отправки приглашения*/
    const sendInvite:ForFunc<string, void> = (erc20) => {

    }

    /** для подключения к реферальной системы stt bonus*/
    async function setSttBonus ()  {
        try {

            if (!validateAddress) {
                showAttention(`Please check the entered ERC20 account.`, 'error')
                return
            }

            if(hasUpliner) {
                sendInvite(ERCUpliner)
            } else {
                dispatch(addLoader(true))
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

                const checkUplainer = await contract.upliner(account)
                const defaultUplinerContract = await contract.defaultUpliner();
                console.log(checkUplainer);
                console.log("Default Upliner:", defaultUplinerContract);

                if (checkUplainer === defaultUplinerContract) {
                    dispatch(addHasUpliner(false))
                    const setUpliner = await contract.setUpliner(ERCUpliner)
                    console.log(setUpliner);
                    console.log(`0x${setUpliner?.data.slice(34)}`);
                    console.log(`account ${ERCUpliner}`)
                    console.log(`0x${setUpliner?.data.slice(34)}` === ERCUpliner)

                    if(`0x${setUpliner?.data.slice(34)}` === account) {
                        showAttention(`Upliner has been successfully set"`, 'success')
                    }
                } else if (checkUplainer !== defaultUplinerContract) {
                    dispatch(addHasUpliner(true))

                }

            }
        } catch (err) {
            console.log(err)
        } finally {
            dispatch(addLoader(false))
        }
    }

    /** для инпута*/
    const changeInputERC20 = (e:React.ChangeEvent<HTMLInputElement>) => {
        setERCUpliner(e.target.value)
    }

    async function checkUpliner() {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);
        const checkUplainer = await contract.upliner(account)
        const defaultUplinerContract = await contract.defaultUpliner();
        console.log(checkUplainer);
        console.log("Default Upliner:", defaultUplinerContract);
        if (checkUplainer !== defaultUplinerContract) {
            dispatch(addHasUpliner(true))
        } else if(checkUplainer !== defaultUplinerContract) {
            dispatch(addHasUpliner(false))
        }
    }

    /** проверяем алайнера у введенного адреса*/
    async function checkUplinerForEnteredERC(account:string) {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);
        const checkUplainer = await contract.upliner(account)
        const defaultUplinerContract = await contract.defaultUpliner();
        console.log(checkUplainer);
        console.log("Default Upliner:", defaultUplinerContract);
        if (checkUplainer !== defaultUplinerContract) {
            setHasUplinerForInvitedAdress(true)
        } else if(checkUplainer !== defaultUplinerContract) {
            setHasUplinerForInvitedAdress(false)
        }
    }


    /** проверка адреса*/
    async function isValidAddress (address: string): Promise<void>  {
        const res = await ethers.isAddress(address);
        if(res) {
            setValidateAddress(true)
            if(hasUpliner) {
                checkUplinerForEnteredERC(ERCUpliner)
            }
        } else {
            setValidateAddress(false)
            setHasUplinerForInvitedAdress(false)
        }
    }

    React.useEffect(() => {
        checkUpliner()
    },[account, provider])

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
                <CustomButton onClick={closeModalSttBonus} classnameWrapper={cls.wrapper_btn}
                              classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg}/>
                </CustomButton>
            </div>
            <div className={cls.cover_block}>
                <div className={cls.gift_header}>
                    <SvgGift className={cls.svg_gift}/>
                    <h3>STT BONUS</h3>
                </div>
                {!hasUpliner &&
                    <div className={cls.cover_text}>
                        Привяжите свой кошелек к
                        глобальной бонусной программе
                        STT и получайте процент от
                        каждой транзакции ваших
                        рефералов в 5 уровнях
                    </div>
                }
                {hasUpliner &&
                    <div className={cls.cover_text}>
                        Получайте больше бонусов и кешбека!
                        Расширьте свою партнерскую сеть, отправив
                        специальную пригласительную ссылку по номеру счета
                    </div>
                }
                <div className={cls.input_block}>
                    <CustomInput value={ERCUpliner}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeInputERC20(e)} type='text'
                                 placeholder='ERC20 счет'
                                 classNameWrapper={cls.wrapper_inp}
                                 svg={<button className={cls.svgQr}><SvgQr className={cls.svgQrs}/></button>}
                                 classNameInput={`${cls.inp} ${deferredAddress?.length >= 1 && !validateAddress && cls.notValidated} ${hasUpliner && hasUplinerForInvitedAdress && cls.notValidated}`}
                    >
                    </CustomInput>
                    {!hasUpliner &&
                        <div className={cls.input_text}>ERC20 - счет вашего пригласителя </div>
                    }
                    {hasUpliner && !hasUplinerForInvitedAdress &&
                        <div className={cls.input_text}>Приглашение от вашего имени будет активно в течении 24 ч с
                            момента отправки</div>
                    }
                    {hasUpliner && hasUplinerForInvitedAdress &&
                        <div className={`${cls.input_text} ${cls.red}`}>Данный пользователь уже состоит в партнерской
                            программе, либо на стадии рассмотрения приглашения</div>
                    }
                </div>
                <div className={cls.cover_btn_confirm}>
                    <div className={cls.stt_values}>
                        <div className={cls.info}>комиссия сети</div>
                    </div>
                    <CustomButton onClick={setSttBonus} classNameBtn={cls.btn} type={'button'}>confirm</CustomButton>
                </div>
            </div>
        </div>
    );
};

export default SttBonusWindow;