import React from 'react';
import { InputsIndicators } from '../../../entities/IndicatorsForUi';
import cls from './styled/textArea.module.scss';

interface ITextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
    type: 'text';
    indicators: InputsIndicators;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = ({ indicators, placeholder, value, onChange, type }: ITextAreaProps) => {
    if (indicators === InputsIndicators.addProfileHobbies) {
        return (
            <div className={cls.coverInput}>
                    <textarea className={`${cls.textArea} ${cls.textAreaText}`} placeholder={placeholder} value={value}
                              onChange={onChange}/>
            </div>
        );
    }
    if (indicators === InputsIndicators.addProfileHash) {
        return (
            <div className={cls.coverInput}>
                <textarea className={`${cls.textArea} ${cls.textAreaHash}`} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        );
    }
    return null;
};

export default TextArea;
