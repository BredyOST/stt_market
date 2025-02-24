import React from 'react';
import cls from './styled/slider.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { ForFunc } from '../../../entities/others';
import { useAddValuesToLocalStorage } from '../../helpers/hooks';

const Slider = () => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { is_in_mlm } = useAppSelector((state) => state.formsAddProfile);

    /** ACTIONS*/
    const { addMlm } = formsAddProfileActions;
    /** сохранение данных с формы в локалсторедже*/
    const { addValueToLocalStorage } = useAddValuesToLocalStorage();

    /** изменить значение mlm*/
    const changeMlm: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = (e) => {
        addValueToLocalStorage('mlm', e.target.value);
        dispatch(addMlm(e.target.value));
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverLine}>
                <div
                    className={cls.line}
                    style={{
                        width: `${+is_in_mlm === 0 ? '0' : `${is_in_mlm}%`}`,
                    }}
                />
            </div>
            <input type='range' min='0' max='100' value={is_in_mlm} className={cls.input} onChange={changeMlm} />
        </div>
    );
};

export default Slider;
