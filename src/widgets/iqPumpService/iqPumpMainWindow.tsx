import React from 'react';
import cls from "./iqPumpMainWindow.module.scss";
import {ReactComponent as SvgBrain} from "./../../assets/svg/brain.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";


interface IIqPumpMainWindowProps {
}


const IqPumpMainWindow = ({}:IIqPumpMainWindowProps) => {
    return (
        <div className={cls.wrapper} >
            <div className={cls.title_cover}>
                <SvgBrain className={cls.svg_brain}/>
                <h3 className={cls.title}>IQ PUMP</h3>
            </div>
            <div className={cls.cover_btn_send_cover}>
                <CustomButton classNameBtn={cls.btn_send} type='button'>Перейти в игру</CustomButton>
            </div>
        </div>
    );
};

export default IqPumpMainWindow;