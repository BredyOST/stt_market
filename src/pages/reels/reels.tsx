import React from 'react';
import CustomInput from "../../shared/ui/customInput/customInput";
import {ReactComponent as SvgQr} from '../../assets/svg/qr.svg'
import cls from './reels.module.scss'
import {InputsIndicators} from "../../entities/uiInterfaces/uiInterfaces";

const Reels = () => {
    return (
        <div className={cls.wrapper}>
            <div className={cls.header}>
                <CustomInput type='text' indicators={InputsIndicators.addSearch} placeholder='search' svg={<SvgQr className={cls.svgQr}/>}/>
            </div>

        </div>
    );
};

export default Reels;