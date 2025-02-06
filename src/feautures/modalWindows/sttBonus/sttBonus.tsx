import React from 'react';
import cls from "./sttBonus.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import {modalAddProfileActions} from "../../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useAppDispatch} from "../../../shared/redux/hooks/hooks";
import {ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import {ReactComponent as SvgGift} from '../../../assets/svg/gift_.svg';
import CustomInput from "../../../shared/ui/customInput/customInput";


const SttBonusWindow = () => {

    const dispatch = useAppDispatch()

    /** states */

    /** actions*/
    const {closeModal, openModal} = modalAddProfileActions

    /** для закрытия модального окна*/
    const closeModalSttBonus = () => {
        const modalSttBonus:any = 'modalSttBonus'
        dispatch(closeModal({modalName: modalSttBonus}))
    }



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
                <div className={cls.cover_text}>
                    Привяжите свой кошелек к
                    глобальной бонусной программе
                    STT и получайте процент от
                    каждой транзакции ваших
                    рефералов в 5 уровнях
                </div>
                <div className={cls.input_block}>
                    <CustomInput type='text' placeholder='ERC20 счет' classNameWrapper={cls.wrapper_inp} classNameInput={cls.inp}/>
                    <div className={cls.input_text}>ERC20 - счет вашего пригласителя </div>
                </div>
                <div className={cls.cover_btn_confirm}>
                    <div className={cls.stt_values}>
                        <div className={cls.values}>1000 STT</div>
                        <div className={cls.info}>+ комиссия сети</div>
                    </div>
                    <CustomButton classNameBtn={cls.btn} type={'button'}>confirm</CustomButton>
                </div>
            </div>
        </div>
    );
};

export default SttBonusWindow;