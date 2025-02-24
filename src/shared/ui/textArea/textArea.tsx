import React from 'react';
import cls from './styled/textArea.module.scss';
import { InputsIndicators } from '../../../entities/uiInterfaces/uiInterfaces';

interface ITextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
    type: 'text';
    indicators?: InputsIndicators;
    classNameWrapper?: string;
    classNameInput?: string;
    placeholder: string;
    value?: string;
    inAppSelector: boolean;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    showLength?: true;
}

const TextArea = ({
    showLength,
    placeholder,
    value,
    onChange,
    type,
    inAppSelector,
    onBlur,
    classNameWrapper,
    classNameInput,
}: ITextAreaProps) => {
    let state: any = null;
    if (inAppSelector) {
        state = inAppSelector[value];
    }

    return (
        <div className={classNameWrapper}>
            <textarea
                className={classNameInput}
                placeholder={placeholder}
                value={inAppSelector ? state : value}
                onChange={onChange}
                onBlur={onBlur}
            />
            {showLength && <div className={cls.indicator_length}>{inAppSelector ? state?.length : value?.toString().length}</div>}
        </div>
    );
};

export default TextArea;
