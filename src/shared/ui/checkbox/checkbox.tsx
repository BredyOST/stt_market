import React from 'react';
import cls from './styled/checkbox.module.scss';
import { CheckBoxIncognito } from '../../../entities/IndicatorsForUi';

interface ICheckboxProps {
    itemList: CheckBoxIncognito[];
    checked: boolean;
    onChange: (arg: number) => void;
}

const Checkbox = React.memo(({ itemList, checked, onChange }: ICheckboxProps) => {
    return (
        <div className={cls.checkboxGroup}>
            {itemList.map((item) => (
                <label key={item.id} className={cls.checkbox}>
                    <input type='checkbox' checked={checked} onChange={() => onChange(item.id)} className={cls.input} />
                    <span className={cls.customCheckbox}></span>
                    {item.label && <span className={cls.label}>{item.label}</span>}
                </label>
            ))}
        </div>
    );
});

export default Checkbox;
