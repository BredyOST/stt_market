import React from 'react';
import {ReactComponent as SvgSafety} from './../../../assets/svg/notifications.svg';
import {ReactComponent as SvgNotification} from './../../../assets/svg/safety.svg';
import CustomSelect from "../../../shared/ui/customSelect/customSelect";
import {useAppDispatch} from "../../../shared/redux/hooks/hooks";
import {languageActions} from "../../../shared/redux/slices/Language/languageSlice";
import cls from './personal.module.scss'


const PersonalBlock = () => {

    const dispatch = useAppDispatch();
    const {changeLanguage} = languageActions


    return (
        <div className={cls.wrapper}>
            {/*<CustomSelect onSelect={changeLanguage} options={LANGUAGES} placeholder='LN' arrowIndicator={false}/>*/}
            {/*<SvgSafety className={cls.safety}/>*/}
            {/*<SvgNotification className={cls.notification}/>*/}
        </div>
    );
};

export default PersonalBlock;