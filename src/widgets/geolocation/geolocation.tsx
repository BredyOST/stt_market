'use client';
import React from 'react';
import cls from './styled/geolocation.module.scss';
import { ERROR_ATTENTION_FOR_FORM, ForFunc, IndicatorsForUi, InputsIndicators } from '../../entities/IndicatorsForUi';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { TITLES } from '../../entities/pageTitiles';
import CustomInput from '../../shared/ui/customInput/customInput';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { formsAddProfileActions } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import SvgArrow from './../../../public/svg/arrow.svg';
import SvgOkay from '../../../public/svg/okay.svg';
import SvgTrash from '../../../public/svg/trash.svg';
import SvgClose from '../../../public/svg/close.svg';
import { showAttention } from '../../shared/helpers/attention';

const Geolocation = React.memo(() => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { geolocation, inputGeo } = useAppSelector((state) => state.formsAddProfile);
    const { modalAddProfileState } = useAppSelector((state) => state.modalWindow);
    /** для открытия выпадающего списка*/
    const [isOpenSelectMenu, setIsOpenSelectMenu] = React.useState<boolean>(false);

    /**ACTIONS*/
    const { addGeo, addInputGeo } = formsAddProfileActions;

    /** FUNCTIONS*/
    /** для изменения состояния показа селекта*/
    const changeIsOpenSelectMenu: ForFunc<void, void> = () => {
        setIsOpenSelectMenu((prevState) => !prevState);
    };
    /** для отслеживания изменений в инпуте ввода геолокации*/
    const changeValueInputGeo: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = (e) => {
        dispatch(addInputGeo(e.target.value));
    };

    /** добавить геолокацию*/
    const handleAddOption: ForFunc<void, void> = () => {
        if (inputGeo.length === 0) {
            showAttention(ERROR_ATTENTION_FOR_FORM.geolocation, 'error');
        }
        if (inputGeo.trim() && !geolocation.includes(inputGeo)) {
            dispatch(addGeo([...geolocation, inputGeo]));
            dispatch(addInputGeo(''));
            showAttention('geolocation has added', 'success');
        }
    };
    /** удалить геолокацию*/
    const handleRemoveOption: ForFunc<string, void> = (option) => {
        dispatch(addGeo(geolocation.filter((item) => item !== option)));
    };

    return (
        <div className={cls.wrapper}>
            <CustomButton
                type='button'
                onClick={changeIsOpenSelectMenu}
                indicator={IndicatorsForUi.addGeoToProfile}
                active={isOpenSelectMenu}
            >
                <div className={cls.coverBtnFileText}>
                    <span> {geolocation.length}</span>
                    {`Geolocation`}
                    <SvgArrow className={`${cls.svgArrow} ${isOpenSelectMenu && cls.active}`} />
                </div>
            </CustomButton>
            {isOpenSelectMenu && (
                <div className={`${cls.dropdown} ${isOpenSelectMenu && cls.active}`}>
                    <div className={cls.coverTitle}>
                        <h3 className={cls.title}>{TITLES.geoLocation}</h3>
                        <CustomButton indicator={IndicatorsForUi.withoutStyle} type='button' onClick={changeIsOpenSelectMenu}>
                            <SvgClose className={cls.close} />
                        </CustomButton>
                    </div>
                    <div className={cls.coverOptions}>
                        {geolocation?.length >= 1 &&
                            geolocation?.map((option: string, index: number) => (
                                <div key={`${option}-${index}`} className={cls.option}>
                                    <div className={cls.startBlockinfo}>
                                        <span>{index + 1}</span>
                                        {option}
                                    </div>
                                    <CustomButton
                                        type='button'
                                        onClick={() => handleRemoveOption(option)}
                                        className={cls.deleteButton}
                                        indicator={IndicatorsForUi.trashAddProfile}
                                        active={modalAddProfileState}
                                    >
                                        <SvgTrash className={`${cls.svgTrash} ${isOpenSelectMenu && cls.active}`} />
                                    </CustomButton>
                                </div>
                            ))}
                    </div>
                    <div className={cls.coverBlockDown}>
                        <CustomInput
                            type='text'
                            value={inputGeo}
                            indicators={InputsIndicators.addGeoLocation}
                            onChange={(e) => changeValueInputGeo(e)}
                            placeholder='Введите геолокацию'
                        />
                        <CustomButton
                            type='button'
                            indicator={IndicatorsForUi.addCurrentGeoToProfile}
                            onClick={handleAddOption}
                            className={cls.addButton}
                        >
                            <SvgOkay className={cls.svgOkay} />
                        </CustomButton>
                    </div>
                    <div className={cls.coverBtnOk}>
                        <CustomButton indicator={IndicatorsForUi.simpleButton} type='button' onClick={changeIsOpenSelectMenu}>
                            ok
                        </CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
});
export default Geolocation;
