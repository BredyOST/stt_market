'use client';
import React from 'react';
import cls from './styled/addProfile.module.scss';
import { TITLES } from '../../entities/pageTitiles';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import {
    ERROR_ATTENTION_FOR_FORM,
    ForFunc,
    IButtonsForFormAddProfile,
    IInputsForFormAddProfile,
    IndicatorsForUi,
    ObjForLocaleStorage,
} from '../../entities/IndicatorsForUi';
import CustomInput from '../../shared/ui/customInput/customInput';
import {
    BUTTONS_FOR_ADD_PROFILE,
    CHECKBOX_INCOGNITO,
    INPUTS_FOR_ADD_PROFILE,
    LANGUAGE_OPTION,
    TABS_OPTIONS,
    TEXT_AREA_FOR_ADD_PROFILE,
} from '../../shared/const/index.const';
import Geolocation from '../../widgets/geolocation/geolocation';
import CustomSelect from '../../shared/ui/customSelect/customSelect';
import Slider from '../../shared/ui/slider/slider';
import Tabs from '../../shared/ui/tabs/tabs';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { FormsAddProfileSchema } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSchema';
import { formsAddProfileActions } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import TextArea from '../../shared/ui/textArea/textArea';
import Checkbox from '../../shared/ui/checkbox/checkbox';
import ClosePopup from '../../widgets/closePopup/closePopup';
import CustomInputFile from '../../shared/ui/customInputFile/customInputFile';
import { useCheckAllForm, useGetLocalStateForForms } from '../../shared/helpers/hooks';
import { showAttention } from '../../shared/helpers/attention';
import { FETCH_REQUEST_LOGO } from '../../shared/redux/sagas/sagaAddProfile/sagaAddLogo';
import { FETCH_REQUEST_BANNER } from '../../shared/redux/sagas/sagaAddProfile/sagaAddBanner';
import { FETCH_REQUEST_SEND_FORM } from '../../shared/redux/sagas/sagaCheckProfile/sagaCheckProfile';
import Loader from '../../widgets/loader/loader';

const AddProfile = () => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { name, mlm, is_incognito, logo, banner, tab, language, hashtags, url, activity_hobbies, geolocation } = useAppSelector(
        (state) => state.formsAddProfile
    );
    const { isPendingAddBanner, isPendingAddLogo } = useAppSelector((state) => state.requestAddProfile);
    const { isPendingSendForm } = useAppSelector((state) => state.requestAddProfile);

    /** ACTIONS*/
    const { updateField, addIncognito } = formsAddProfileActions;

    /** CUSTOM HOOKS*/
    /** проверка формы перед отправкой*/
    const { validateForm } = useCheckAllForm();
    /** проверка хранилища для обновления данных формы если они не заполнены*/
    const { checkLocalStorage } = useGetLocalStateForForms();

    /** FUNCTIONS
    /** для смены состояния чекбокса */
    const changeIncognito: ForFunc<number, void> = React.useCallback(
        (id: number) => {
            dispatch(addIncognito(!is_incognito));
        },
        [addIncognito, is_incognito]
    );

    /** универсальная формула для смены состояний полей формы */
    const changeState = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, item: keyof FormsAddProfileSchema): void => {
            dispatch(updateField({ name: item, value: e.target.value }));
        },
        [updateField]
    );

    /** для добавления файлов logo и  video */
    const addFile = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>, item: keyof FormsAddProfileSchema): Promise<void> => {
        const files = e.target.files;
        const file = files[0];

        if (files.length > 1) {
            showAttention(ERROR_ATTENTION_FOR_FORM.muchFiles, 'error');
            return;
        }
        if (files.length === 1 && files[0].size >= 3000000 && item === BUTTONS_FOR_ADD_PROFILE[0].name) {
            showAttention(ERROR_ATTENTION_FOR_FORM.maxSizeLogo, 'error');
            return;
        }

        if (files.length === 1 && files[0].size >= 15000000 && item === BUTTONS_FOR_ADD_PROFILE[1].name) {
            showAttention(ERROR_ATTENTION_FOR_FORM.maxSizeBanner, 'error');
            return;
        }

        if (files && files.length > 0) {
            if (item === BUTTONS_FOR_ADD_PROFILE[0].name) {
                dispatch({ type: FETCH_REQUEST_LOGO, payload: file });
            } else if (item === BUTTONS_FOR_ADD_PROFILE[1].name) {
                dispatch({ type: FETCH_REQUEST_BANNER, payload: file });
            }
        }
    }, []);

    /** отправка заполненной формы*/
    const sendForm: ForFunc<void, void> = () => {
        const result: boolean = validateForm();
        /** добававить # к словам*/
        const formattedHashtags = hashtags
            .split(',')
            .map((tag) => tag.trim()) // Убираем пробелы вокруг слов
            .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)) // Добавляем # только если его нет
            .join(', ');

        if (result) {
            const obj: ObjForLocaleStorage = {
                name: name,
                url: url,
                activity_hobbies: activity_hobbies,
                hashtags: formattedHashtags,
                is_incognito: is_incognito,
                logo: logo,
                banner: banner,
                geolocation: geolocation,
                marketingPercent: tab,
                mlm: mlm,
                language: language,
            };

            let currentLocal: string = localStorage.getItem('formData');
            if (currentLocal) {
                localStorage.removeItem('formData');
            }
            localStorage.setItem('formData', JSON.stringify(obj));

            dispatch({
                type: FETCH_REQUEST_SEND_FORM,
                payload: {
                    activity_hobbies: activity_hobbies,
                    hashtags: hashtags,
                    is_incognito: is_incognito,
                    name: name,
                    url: url,
                },
            });
        }
    };

    React.useEffect(() => {
        checkLocalStorage();
    }, []);

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverTitle}>
                <h3 className={cls.title}>{TITLES.addProfile}</h3>
            </div>
            <ClosePopup />
            <div className={cls.bodyBlock}>
                <div className={cls.leftBlock}>
                    <div className={cls.coverBtns}>
                        {BUTTONS_FOR_ADD_PROFILE?.length >= 1 &&
                            BUTTONS_FOR_ADD_PROFILE?.map((item: IButtonsForFormAddProfile) => (
                                <CustomInputFile
                                    key={item.id}
                                    type='file'
                                    isLoadingLogo={isPendingAddLogo}
                                    isLoadingBanner={isPendingAddBanner}
                                    loadedLogo={logo}
                                    loadedBanner={banner}
                                    indicator={item.indicator}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        addFile(e, item.name as keyof FormsAddProfileSchema)
                                    }
                                >
                                    {item.urlSvg}
                                </CustomInputFile>
                            ))}
                    </div>
                    <div className={cls.aboutYou}>
                        {INPUTS_FOR_ADD_PROFILE?.length >= 1 &&
                            INPUTS_FOR_ADD_PROFILE?.map((item: IInputsForFormAddProfile) => (
                                <CustomInput
                                    type='text'
                                    indicators={item.indicator}
                                    placeholder={item.label}
                                    key={item.id}
                                    value={String(
                                        useAppSelector((state) => state.formsAddProfile[item.name as keyof FormsAddProfileSchema])
                                    )}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        changeState(e, item.name as keyof FormsAddProfileSchema)
                                    }
                                />
                            ))}
                    </div>
                    <div className={cls.aboutYou}>
                        {TEXT_AREA_FOR_ADD_PROFILE?.length >= 1 &&
                            TEXT_AREA_FOR_ADD_PROFILE?.map((item: IInputsForFormAddProfile) => (
                                <TextArea
                                    type='text'
                                    indicators={item.indicator}
                                    placeholder={item.label}
                                    key={item.id}
                                    value={String(
                                        useAppSelector((state) => state.formsAddProfile[item.name as keyof FormsAddProfileSchema])
                                    )}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        changeState(e, item.name as keyof FormsAddProfileSchema)
                                    }
                                />
                            ))}
                    </div>
                </div>
                <div className={cls.rightBlock}>
                    <Geolocation />
                    <CustomSelect options={LANGUAGE_OPTION} placeholder='Choose Language' arrowIndicator={true} />
                    <div className={cls.coverValue}>
                        <div>MLM</div>
                        <span>{mlm}%</span>
                    </div>
                    <Slider />
                    <div className={cls.coverTabs}>
                        <Tabs options={TABS_OPTIONS} />
                    </div>
                    <div className={cls.coverIncognito}>
                        <Checkbox itemList={CHECKBOX_INCOGNITO} checked={is_incognito} onChange={changeIncognito} />
                    </div>
                    <div className={cls.coverAddBtn}>
                        <CustomButton onClick={sendForm} type='button' indicator={IndicatorsForUi.simpleButton}>
                            <div className={cls.textBtnAdd}>
                                <span className={cls.firstSpan}>Add</span>
                                <span className={cls.lastSpan}>for 1000 STT</span>
                            </div>
                        </CustomButton>
                    </div>
                </div>
            </div>
            {isPendingSendForm && <Loader />}
        </div>
    );
};

export default AddProfile;
