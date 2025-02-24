import React from 'react';
import cls from './styled/checkbox.module.scss';
import { CheckBoxIncognito } from '../../../entities/uiInterfaces/uiInterfaces';
import { useAddValuesToLocalStorage } from '../../helpers/hooks';

interface IToggleSwitchProps {
    itemList: any;
    checked: boolean;
    onChange: (arg: number) => void;
}

const ToggleSwitch = React.memo(({ itemList, checked, onChange }: IToggleSwitchProps) => {
    return (
        <div className={`${cls.checkboxGroup} ${checked && cls.checked}`}>
            {itemList.map((item) => (
                <label key={item.id} className={cls.toggleSwitch}>
                    <input type='checkbox' checked={checked} onChange={() => onChange(item.id)} className={cls.input} />
                    <span className={cls.slider}></span>
                    {item.label && <span className={cls.label}>{item.label}</span>}
                </label>
            ))}
        </div>
    );
});

export default ToggleSwitch;
