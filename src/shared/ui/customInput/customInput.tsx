import React, { HTMLAttributes } from 'react';
import cls from './styled/customInput.module.scss';
import {useAppSelector} from "../../redux/hooks/hooks";
import {InputsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'text' | 'password';
    indicators: InputsIndicators;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inAppSelector?: boolean;
    disable?: boolean;
    svg?:React.ReactElement;
    codeHasWritten?: boolean;
    onBlur?: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({ type = 'text', indicators, placeholder, value, onChange, inAppSelector, disable, svg, codeHasWritten, onBlur}: ICustomInputProps) => {

    const { name, mlm, is_incognito, logoLink, bannerLink, tab, language, hashtags, url, activity_hobbies, coordinates } = useAppSelector(
        (state) => state.formsAddProfile
    );

    let state: string | undefined = undefined;
    if(inAppSelector) {
        state = inAppSelector[value]
    }

    /** инпут для ввода url*/
    /** инпут для ввода имени*/
    if (indicators === InputsIndicators.addProfileSiteUrl || indicators === InputsIndicators.addProfileName) {
        return (
            <div className={cls.coverInput}>
                <input
                    type={type}
                    className={`${cls.input} ${codeHasWritten ? cls.codeWritten : ''}`}
                    placeholder={placeholder}
                    value={inAppSelector ? state : value}
                    onChange={onChange}
                    disabled={disable}
                    onBlur={onBlur}
                />
                {svg && !codeHasWritten && svg}
            </div>
        );
    }

    /** инпут для ввода geolocation*/
    if (indicators === InputsIndicators.addGeoLocation) {
        return (
            <div className={cls.coverInputGeo}>
                <input
                    className={`${cls.input} ${cls.inputGeo}`}
                    placeholder={placeholder}
                    type={type}
                    value={inAppSelector ? state : value}
                    onChange={onChange && onChange}
                />
            </div>
        );
    }

    /** инпут для sttBonus модуля*/
    if (indicators === InputsIndicators.addSttBonus) {
        return (
            <div className={cls.coverInputStt}>
                <input
                    className={`${cls.input} ${cls.inputStt} ${codeHasWritten && cls.codeWritten}`}
                    placeholder={placeholder}
                    type={type}
                    disabled={disable && true}
                    value={inAppSelector ? state : value}
                    onChange={onChange && onChange}
                />
                {svg && !codeHasWritten  && svg}
            </div>
        );
    }

    /** инпут для sttBonus модуля*/
    if (indicators === InputsIndicators.addSearch) {
        return (
            <div className={cls.coverInput}>
                <input
                    className={`${cls.input} ${cls.inputSearch}`}
                    placeholder={placeholder}
                    type={type}
                    disabled={disable && true}
                    value={inAppSelector ? state : value}
                    onChange={onChange && onChange}
                />
                {svg && svg}
            </div>
        );
    }


    return null;
};

export default CustomInput;
