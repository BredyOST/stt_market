'use client';
import React from 'react';
import cls from './styled/slider.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { ForFunc } from '../../../entities/IndicatorsForUi';

const Slider = () => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { mlm } = useAppSelector((state) => state.formsAddProfile);

    /** ACTIONS*/
    const { addMlm } = formsAddProfileActions;

    /** изменить значение mlm*/
    const changeMlm: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = (e) => {
        dispatch(addMlm(e.target.value));
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverLine}>
                <div
                    className={cls.line}
                    style={{
                        width: `${+mlm === 0 ? '0' : `${mlm}%`}`,
                    }}
                />
            </div>
            <input type='range' min='0' max='100' value={mlm} className={cls.input} onChange={changeMlm} />
        </div>
    );
};

export default Slider;
