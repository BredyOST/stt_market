import React, { HTMLAttributes } from 'react';
import cls from './styled/customInput.module.scss';
import { useAppSelector } from '../../redux/hooks/hooks';
import { InputsIndicators } from '../../../entities/uiInterfaces/uiInterfaces';

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'text' | 'password';
    placeholder: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    classNameWrapper?: string;
    classNameInput?: string;
    indicators?: InputsIndicators;
    inAppSelector?: boolean;
    disable?: boolean;
    svg?: React.ReactElement;
    codeHasWritten?: boolean;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style?: any;
    showLength?: true;
}

const CustomInput = ({
    type = 'text',
    indicators,
    placeholder,
    value,
    onChange,
    inAppSelector,
    disable,
    svg,
    codeHasWritten,
    onBlur,
    classNameWrapper,
    classNameInput,
    style,
    showLength,
}: ICustomInputProps) => {
    const { name, is_in_mlm, is_incognito, logoLink, bannerLink, tab, language, hashtags, url, activity_hobbies, coordinates } =
        useAppSelector((state) => state.formsAddProfile);

    let state: string | undefined = undefined;
    if (inAppSelector) {
        state = inAppSelector[value];
    }

    return (
        <div className={classNameWrapper}>
            <input
                className={classNameInput}
                placeholder={placeholder}
                type={type}
                onBlur={onBlur}
                value={inAppSelector ? state : value}
                onChange={onChange && onChange}
                style={style}
                disabled={disable}
            />
            {svg && !codeHasWritten && svg}
            {showLength && <div className={cls.indicator_length}>{inAppSelector ? state?.length : value?.toString().length}</div>}
        </div>
    );

    // if (!indicators) {
    //     return (
    //         <div className={classNameWrapper}>
    //             <input
    //                 type={type}
    //                 className={classNameInput}
    //                 placeholder={placeholder}
    //                 value={inAppSelector ? state : value}
    //                 onChange={onChange}
    //                 disabled={disable}
    //                 onBlur={onBlur}
    //                 style={style}
    //             />
    //             {svg && !codeHasWritten && svg}
    //             {showLength && <div className={cls.indicator_length}>{inAppSelector ? state?.length : value?.toString().length}</div>}
    //         </div>
    //     );
    // }

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
                {svg && !codeHasWritten && svg}
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
