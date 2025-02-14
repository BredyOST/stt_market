import React from 'react';
import cls from "./transferForm.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {IModalWindowStatesSchema} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useAppDispatch} from "../../../shared/redux/hooks/hooks";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';

interface ITransfer {
    transaction: {
        'hash': string,
        'type': string,
        'modifier': string,
        'class': string,
        'block': string,
        'priority': number,
        'amount': string,
        'timestamp': string,
        'from': string | null,
        'to': string | null

    }
}

const TransferForm = ({transaction}:ITransfer) => {

    const dispatch = useAppDispatch()

    /** STATES*/

    /** ACTIONS*/
    const {closeModal, openModal} = modalAddProfileActions

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModalSwap = () => {
        const modal:string = 'modalTransferForm'
        dispatch(closeModal({modalName: modal as keyof IModalWindowStatesSchema}))
    }

    return (
        <div className={cls.wrapper}>
            <div className={cls.stt_modal_header}>
                <div className={cls.notification_header}>TRANSFER FORM</div>
                <CustomButton onClick={closeModalSwap} classnameWrapper={cls.wrapper_btn}
                              classNameBtn={cls.cover_btn} type='button'>
                    <SvgClose className={cls.close_svg}/>
                </CustomButton>
            </div>
            <div className={cls.cover_info}>
                <div className={cls.hash} >{transaction?.from.slice(26)}</div>
                <div className={cls.amount}>{transaction?.amount} STT</div>
                <div className={cls.timestamp}>{new Date(transaction?.timestamp).getDay()}/{new Date(transaction?.timestamp).getMonth()}/{new Date(transaction?.timestamp).getFullYear()} {new Date(transaction?.timestamp).getHours()}:{new Date(transaction?.timestamp).getMinutes()}
                </div>
                <div className={cls.hash} >{transaction?.to.slice(26)}</div>
            </div>
            <CustomButton classNameBtn={cls.btn_ok} type='button'
                          onClick={closeModalSwap}>ok
            </CustomButton>
        </div>
    );
};

export default TransferForm;