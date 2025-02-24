import React from 'react';
import cls from './styled/geolocation.module.scss';
import { ForFunc } from '../../entities/others';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { TITLES } from '../../entities/pageTitiles';
import CustomInput from '../../shared/ui/customInput/customInput';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { formsAddProfileActions } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { ReactComponent as SvgArrow } from './../../assets/svg/arrow.svg';
import { ReactComponent as SvgOkay } from './../../assets/svg/okay.svg';
import { ReactComponent as SvgTrash } from './../../assets/svg/trash.svg';
import { ReactComponent as SvgClose } from '../../assets/svg/close.svg';
import { IndicatorsForUi, InputsIndicators } from '../../entities/uiInterfaces/uiInterfaces';
import { useAddProfile, useAddValuesToLocalStorage } from '../../shared/helpers/hooks';
import { coordinates, Feature } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSchema';
import { showAttention } from '../../shared/helpers/attention';

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
    const updateAddProleState = useAddProfile();
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

    const { addValueToLocalStorage } = useAddValuesToLocalStorage();

    /** добавить геолокацию*/
    const handleAddOption: ForFunc<Feature, any> = (item: Feature) => {
        const street = item.properties.street ?? item.properties.name;

        if (
            !item.geometry.coordinates ||
            !item.properties.country ||
            !item.properties.city ||
            !street ||
            !item.properties.housenumber ||
            !item?.properties?.postcode
        ) {
            console.log(111);
            showAttention('Please enter the full address', 'warning');
            return;
        }

        const obj: coordinates = {
            id: coordinates?.length ? coordinates?.length + 1 : 1,
            coordinates: item.geometry.coordinates,
            country: item.properties.country,
            city: item.properties.city,
            street: street,
            housenumber: item.properties.housenumber,
            postcode: item?.properties?.postcode,
        };

        if (coordinates?.length == 0 || !coordinates) {
            updateAddProleState('coordinates', [obj]);
            addValueToLocalStorage('coordinates', [obj]);
        } else if (coordinates?.length >= 1) {
            let newlists = [];
            newlists = coordinates?.filter((elem: coordinates) => {
                if (elem?.coordinates[0] === obj.coordinates[0] && elem?.coordinates[1] === obj.coordinates[1]) {
                    return elem;
                }
            });

            if (!newlists || newlists?.length === 0) {
                updateAddProleState('coordinates', [...coordinates, obj]);
                addValueToLocalStorage('coordinates', [...coordinates, obj]);
            } else {
                showAttention('These coordinates have already been added', 'warning');
            }
        }

        updateAddProleState('inputGeo', '');
        setListCity([]);
    };
    /** удалить геолокацию*/
    const handleRemoveOption: ForFunc<number, void> = (option) => {
        const newlists = coordinates
            .filter((elem: coordinates) => elem.id !== option)
            .map((elem: coordinates, index) => {
                return { ...elem, id: index + 1 };
            });

        if (newlists?.length >= 1) {
            updateAddProleState('coordinates', [...newlists]);
            addValueToLocalStorage('coordinates', [...newlists]);
        } else {
            updateAddProleState('coordinates', null);
            addValueToLocalStorage('coordinates', null);
        }
    };

    /** добавить при клике адресс из выпадающего списка*/
    const addCity = (item) => {};

    return (
        <div className={cls.wrapper}>
            <CustomButton
                type='button'
                classnameWrapper={cls.coverBtnGeo}
                classNameBtn={cls.geo}
                onClick={changeIsOpenSelectMenu}
                active={isOpenSelectMenu}
            >
                <div className={cls.coverBtnFileText}>
                    <span> {!coordinates ? 0 : coordinates?.length}</span>
                    <div className={cls.geolocation_text}>Geolocation</div>
                    <SvgArrow className={`${cls.svgArrow} ${isOpenSelectMenu && cls.active}`} />
                </div>
            </CustomButton>
            {isOpenSelectMenu && (
                <div className={`${cls.dropdown} ${isOpenSelectMenu && cls.active}`}>
                    <div className={cls.coverTitle}>
                        <h3 className={cls.title}>{TITLES.geoLocation}</h3>
                        <CustomButton classnameWrapper={cls.withoutStyle} type='button' onClick={changeIsOpenSelectMenu}>
                            <SvgClose className={cls.close} />
                        </CustomButton>
                    </div>
                    <div className={cls.coverOptions}>
                        {coordinates?.length >= 1 &&
                            coordinates.map((item, index) => (
                                <div key={item.id} className={cls.option}>
                                    <div className={cls.startBlockinfo}>
                                        <span>{index + 1}</span>
                                        {item?.country}, {item?.city}, {item?.street}, {item?.housenumber}
                                    </div>
                                    <CustomButton
                                        type='button'
                                        onClick={() => handleRemoveOption(item.id)}
                                        classnameWrapper={cls.wrapper_trash}
                                        classNameBtn={cls.deleteButton}
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
                            classNameWrapper={cls.coverInputGeo}
                            classNameInput={cls.input_geo}
                            onChange={(e) => changeValueInputGeo(e)}
                            placeholder='Введите геолокацию'
                        />
                        <CustomButton type='button' classNameBtn={cls.okey} onClick={handleAddOption} className={cls.addButton}>
                            <SvgOkay className={cls.svgOkay} />
                        </CustomButton>
                        {listCity.length >= 1 && (
                            <div className={cls.listCity}>
                                {listCity.slice(0, 4).map((item: Feature) => {
                                    const { city, district, state, country, postcode, name, housenumber, street } = item.properties;
                                    const address = `${country && country}, ${city ? city : ''}, ${street ?? name}, ${housenumber ? housenumber : ''}`;
                                    return (
                                        <li onClick={() => handleAddOption(item)} key={item?.properties?.osm_id} className={cls.list}>
                                            {address}
                                        </li>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className={cls.coverBtnOk}>
                        <CustomButton type='button' onClick={changeIsOpenSelectMenu} classNameBtn={cls.simple}>
                            ok
                        </CustomButton>
                    </div>
                </div>
            )}
        </div>
    );
});
export default Geolocation;
