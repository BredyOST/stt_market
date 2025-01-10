import React from 'react';
import cls from './styled/geolocation.module.scss';
import { ForFunc } from '../../entities/IndicatorsForUi';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { TITLES } from '../../entities/pageTitiles';
import CustomInput from '../../shared/ui/customInput/customInput';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { formsAddProfileActions } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { ReactComponent as SvgArrow } from './../../assets/svg/arrow.svg';
import { ReactComponent as SvgOkay } from './../../assets/svg/okay.svg';
import { ReactComponent as SvgTrash } from './../../assets/svg/trash.svg';
import { ReactComponent as SvgClose } from '../../assets/svg/close.svg';
import {IndicatorsForUi, InputsIndicators} from "../../entities/uiInterfaces/uiInterfaces";

export interface Feature {
    geometry: {
        coordinates: number[];
        type: string;
    };
    type: string;
    properties: {
        osm_type: string;
        extent:  number[];
        osm_id: number;
        country: string;
        osm_key: string;
        city: string;
        street: string;
        countrycode: string;
        osm_value: string;
        district: string;
        postcode: string;
        name: string;
        state: string;
        type: string;
        housenumber: string;
    };
}

interface ApiResponse {
    type: any;
    features: Feature[];
}



const Geolocation = React.memo(() => {
    const dispatch = useAppDispatch();
    const [listCity, setListCity] = React.useState<Feature[] | []>([]);

    /** STATES*/
    const { coordinates, inputGeo } = useAppSelector((state) => state.formsAddProfile);
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
    const changeValueInputGeo: ForFunc<React.ChangeEvent<HTMLInputElement>, void> = async (e) => {
        dispatch(addInputGeo(e.target.value));
        if (e?.target?.value?.length >= 1) {
            const result = await fetch(`https://photon.komoot.io/api?q=${e.target.value}&limit=5`);
            const data: ApiResponse = await result.json();
            console.log(listCity)
            // Типизация данных
            if (Array.isArray(data?.features)) {
                setListCity(data.features);
            } else {
                setListCity([]);
            }
        } else {
            setListCity([]);
        }
    };

    /** добавить геолокацию*/
    const handleAddOption: ForFunc<Feature, any> = (item:Feature) => {
        // console.log(item.geometry.coordinates)
        dispatch(addGeo(item));
        dispatch(addInputGeo(''));
        setListCity([])
        // if (inputGeo.length === 0) {
        //     showAttention(ERROR_ATTENTION_FOR_FORM.geolocation, 'error');
        // }
        // if (inputGeo.trim() && !coordinates.includes(inputGeo)) {
        //     dispatch(addGeo( [...item?.geometry.coordinates]));
        //     dispatch(addInputGeo(''));
        //     showAttention('geolocation has added', 'success');
        // }
    };
    /** удалить геолокацию*/
    const handleRemoveOption: ForFunc<string, void> = (option) => {
        dispatch(addGeo(null));
        // dispatch(addGeo(coordinates.filter((item) => item !== option)));
    };

    /** добавить при клике адресс из выпадающего списка*/
    const addCity = (item) => {

    }

    return (
        <div className={cls.wrapper}>
            <CustomButton
                type='button'
                onClick={changeIsOpenSelectMenu}
                indicator={IndicatorsForUi.addGeoToProfile}
                active={isOpenSelectMenu}
            >
                <div className={cls.coverBtnFileText}>
                    <span> {coordinates?.geometry ? 1 : 0}</span>
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
                        {coordinates &&
                            <div className={cls.option}>
                                <div className={cls.startBlockinfo}>
                                    <span>{1}</span>
                                    {coordinates?.properties?.country}, {coordinates?.properties?.city}, {coordinates?.properties?.street ?? coordinates?.properties.name}, {coordinates?.properties?.housenumber}
                                </div>
                                <CustomButton
                                    type='button'
                                    onClick={handleRemoveOption}
                                    className={cls.deleteButton}
                                    indicator={IndicatorsForUi.trashAddProfile}
                                    active={modalAddProfileState}
                                >
                                    <SvgTrash className={`${cls.svgTrash} ${isOpenSelectMenu && cls.active}`}/>
                                </CustomButton>
                            </div>
                        }
                        {/*{coordinates?.length >= 1 &&*/}
                        {/*    coordinates?.map((option: string, index: number) => (*/}
                        {/*        <div key={`${option}${index}`} className={cls.option}>*/}
                        {/*            <div className={cls.startBlockinfo}>*/}
                        {/*                <span>{index + 1}</span>*/}
                        {/*                {option}*/}
                        {/*            </div>*/}
                        {/*            <CustomButton*/}
                        {/*                type='button'*/}
                        {/*                onClick={() => handleRemoveOption(option)}*/}
                        {/*                className={cls.deleteButton}*/}
                        {/*                indicator={IndicatorsForUi.trashAddProfile}*/}
                        {/*                active={modalAddProfileState}*/}
                        {/*            >*/}
                        {/*                <SvgTrash className={`${cls.svgTrash} ${isOpenSelectMenu && cls.active}`} />*/}
                        {/*            </CustomButton>*/}
                        {/*        </div>*/}
                        {/*    ))}*/}
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
                        {listCity.length >= 1 &&
                            <div className={cls.listCity}>
                                {listCity.length >= 1 && listCity.map((item: Feature) => {
                                    const {
                                        city,
                                        district,
                                        state,
                                        country,
                                        postcode,
                                        name,
                                        housenumber,
                                        street
                                    } = item.properties;
                                    const address = `${country}, ${city}, ${street ?? name}, ${housenumber}`;
                                    return <li onClick={() => handleAddOption(item)} key={item?.properties?.osm_id}
                                               className={cls.list}>
                                        {address}
                                    </li>
                                })}
                            </div>
                        }

                    </div>
                    <div className={cls.coverBtnOk}>
                        <CustomButton indicator={IndicatorsForUi.simpleButton} type='button'
                                      onClick={changeIsOpenSelectMenu}>
                            ok
                        </CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
});
export default Geolocation;
