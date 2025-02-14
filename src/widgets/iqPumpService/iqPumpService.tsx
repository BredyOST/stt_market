import React from 'react';
import cls from './iqPumpService.module.scss';
import {ReactComponent as SvgBrain} from "./../../assets/svg/brain.svg";
import CustomInput from "../../shared/ui/customInput/customInput";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {useAppSelector} from "../../shared/redux/hooks/hooks";

const IqPumpService = () => {


    const {account, telegramUsername } = useAppSelector(state => state.authSlice);
    const {sttBalance} = useAppSelector(state => state.walletSlice);

    return (
        <div className={cls.wrapper}>
            <div className={cls.title_cover}>
                <h3 className={cls.title}>IQ PUPMP</h3>
                <SvgBrain className={cls.svg_brain}/>
                <div className={cls.th_info}>
                    <div className={cls.user_name_tg}>{telegramUsername}</div>
                    <div className={cls.adress}>{account}</div>
                </div>
            </div>
            <div className={cls.balance_block}>
                    <h3 className={cls.subtitle_block}>balance</h3>
                    <div className={cls.balance_stt}>1234.564 STT</div>
                    <div className={cls.btns_block}>
                        <CustomButton type='button' classNameBtn={`${cls.btn_cash} ${cls.left}`}>
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
                <CustomInput type='text' placeholder='0.00' classNameWrapper={cls.wrap_inp} classNameInput={cls.inp}/>
                <div className={cls.range}>Min 1,000 - 5, 467 STT</div>
            </div>
            <div className={cls.cover_btn_send_cover}>
                <CustomButton classNameBtn={cls.btn_send} type='button'>Подтвердить</CustomButton>
            </div>
        </div>
    );
};

export default IqPumpService;