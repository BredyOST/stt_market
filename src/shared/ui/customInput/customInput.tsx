'use client';
import React, { HTMLAttributes } from 'react';
import { InputsIndicators } from '../../../entities/IndicatorsForUi';
import cls from './styled/customInput.module.scss';

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'text' | 'password';
    indicators: InputsIndicators;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = ({ type = 'text', indicators, placeholder, value, onChange }: ICustomInputProps) => {
    /** инпут для ввода имени*/
    if (indicators === InputsIndicators.addProfileName) {
        return (
            <div className={cls.coverInput}>
                <input type='text' className={cls.input} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        );
    }

    /** инпут для ввода url*/
    if (indicators === InputsIndicators.addProfileSiteUrl) {
        return (
            <div className={cls.coverInput}>
                <input type='text' className={cls.input} placeholder={placeholder} value={value} onChange={onChange} />
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
                    value={value}
                    onChange={onChange && onChange}
                />
            </div>
        );
    }

    return null;
};

export default CustomInput;
