import React from 'react';
import cls from './styled/textArea.module.scss';
import {InputsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";

interface ITextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
    type: 'text';
    indicators: InputsIndicators;
    placeholder: string;
    value?: string;
    inAppSelector:boolean
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e:React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = ({ indicators, placeholder, value, onChange, type, inAppSelector, onBlur }: ITextAreaProps) => {

    let state:any = null;
    if(inAppSelector) {
        state = inAppSelector[value]
    }

    /** текстовое поле для ввода хобби */
    if (indicators === InputsIndicators.addProfileHobbies) {
        return (
            <div className={cls.coverInput}>
                <textarea className={`${cls.textArea} ${cls.textAreaText}`} placeholder={placeholder} value={inAppSelector ? state : value} onChange={onChange} onBlur={onBlur} />
            </div>
        );
    }

    /** текстовое поле для ввода хешей */
    if (indicators === InputsIndicators.addProfileHash) {
        return (
            <div className={cls.coverInput}>
                <textarea className={`${cls.textArea} ${cls.textAreaHash}`} placeholder={placeholder} value={inAppSelector ? state : value}  onChange={onChange} onBlur={onBlur} />
            </div>
        );
    }

    return null;
};

export default TextArea;
