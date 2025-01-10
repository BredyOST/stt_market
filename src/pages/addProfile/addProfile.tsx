import React from 'react';
import cls from './addProfile.module.scss';
import { TITLES } from '../../entities/pageTitiles';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import {
    ForFunc,
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
import {useAddValuesToLocalStorage, useCheckAllForm, useGetLocalStateForForms} from '../../shared/helpers/hooks';
import { showAttention } from '../../shared/helpers/attention';
import Loader from '../../widgets/loader/loader';
import {FETCH_REQUEST_SEND_FORM, FETCH_REQUEST_UPLOAD_FILE} from "../../shared/redux/config/store";
import {ERROR_ATTENTION_FOR_FORM} from "../../entities/errors/errors";
import {ObjForLocaleStorage} from "../../entities/localStorage/localStarage";
import {
    IButtonsForFormAddProfile,
    IInputsForFormAddProfile, IndicatorsForUi,
    SelectsIndicators
} from "../../entities/uiInterfaces/uiInterfaces";

const AddProfile = (props) => {

    const dispatch = useAppDispatch();

    /** STATES*/
    const { name, mlm, is_incognito, logoLink, bannerLink, tab, language, hashtags, url, activity_hobbies, coordinates } = useAppSelector(
        (state) => state.formsAddProfile
    );

    const { logo, banner, form} = useAppSelector((state) => state.requestAddProfile);

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
        [updateField, name, mlm, is_incognito, logoLink, bannerLink, tab, language, hashtags, url, activity_hobbies, coordinates ]
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

        if (files && files.length > 0 ) {
            if (item === BUTTONS_FOR_ADD_PROFILE[0].name) {
                dispatch({ type: FETCH_REQUEST_UPLOAD_FILE, payload: {file: file, type: 'logo'} });
            } else if (item === BUTTONS_FOR_ADD_PROFILE[1].name) {
                dispatch({ type: FETCH_REQUEST_UPLOAD_FILE, payload: {file: file, type: 'banner'} });
            }
        }
    }, []);

    /** отправка заполненной формы*/
    const sendForm: ForFunc<void, void> = () => {

        const result: boolean = validateForm();
        /** добававить # к словам*/
        const formattedHashtags = hashtags
            .split(',')
            .map((tag) => tag.trim())
            .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
            .join(', ');

        if (result) {
            const obj: ObjForLocaleStorage = {
                name: name,
                url: url,
                activity_hobbies: activity_hobbies,
                hashtags: formattedHashtags,
                is_incognito: is_incognito,
                logoLink: logoLink,
                bannerLink: bannerLink,
                coordinates: coordinates,
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
                    adress: `${coordinates?.properties?.country}, ${coordinates?.properties?.city}, ${coordinates?.properties?.street ?? coordinates?.properties.name}, ${coordinates?.properties?.housenumber}`,
                    coordinates: [...coordinates?.geometry?.coordinates],
                    hashtags: formattedHashtags,
                    is_incognito: is_incognito,
                    name: name,
                    url: url,
                    wallet_number: props.account,
                    image_data: {image_path: logoLink},
                    video_data: {video_path: bannerLink}
                }
            });
        }
    };

    const {addValueToLocalStorage} = useAddValuesToLocalStorage()

    React.useEffect(() => {
        checkLocalStorage();
    }, []);

    // console.log(useAppSelector(state => state.formsAddProfile));
    // console.log(useAppSelector(state => state.requestAddProfile));
    console.log(typeof is_incognito)
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
                                    errorLoaded={item.name === 'logo' ? Boolean(logo.error) : Boolean(banner.error)}
                                    loadedFile={item.name === 'logo' ? Boolean(logoLink) : Boolean(bannerLink)}
                                    isLoadingFile={item.name === 'logo' ? logo.isPending : banner.isPending}
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
                            INPUTS_FOR_ADD_PROFILE?.map((item: IInputsForFormAddProfile, index) => (
                                <CustomInput
                                    type='text'
                                    indicators={item.indicator}
                                    placeholder={item.label}
                                    key={item.id}
                                    inAppSelector={false}
                                    onBlur={() => {
                                        const currentValue:string =
                                            item.name === 'name' ? name : url;
                                        addValueToLocalStorage(item.name, currentValue);
                                    }}
                                    value = {item.name === 'name' ? name : url}
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
                                    inAppSelector={false}
                                    value ={item.name === 'activity_hobbies' ? activity_hobbies : hashtags}
                                    onBlur={() => {
                                        const currentValue:string =
                                            item.name === 'activity_hobbies' ? activity_hobbies : hashtags;
                                        addValueToLocalStorage(item.name, currentValue);
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        changeState(e, item.name as keyof FormsAddProfileSchema)
                                    }
                                />
                            ))}
                    </div>
                </div>
                <div className={cls.rightBlock}>
                    <Geolocation />
                    <CustomSelect indicator={SelectsIndicators.address} options={LANGUAGE_OPTION} placeholder='Choose Language' arrowIndicator={true} />
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
            {form?.isPending && <Loader />}
        </div>
    );
};

export default AddProfile;
