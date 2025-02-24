import React from 'react';
import cls from './addProfile.module.scss';
import { TITLES } from '../../entities/pageTitiles';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { ForFunc } from '../../entities/others';
import CustomInput from '../../shared/ui/customInput/customInput';
import {
    BUTTONS_FOR_ADD_PROFILE,
    INPUTS_FOR_ADD_PROFILE,
    LANGUAGE_OPTION,
    TABS_OPTIONS,
    TEXT_AREA_FOR_ADD_PROFILE,
} from '../../shared/const/index.const';
import Geolocation from '../../widgets/geolocation/geolocation';
import CustomSelect from '../../shared/ui/customSelect/customSelect';
import Slider from '../../shared/ui/slider/slider';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { FormsAddProfileSchema } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSchema';
import { formsAddProfileActions } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import TextArea from '../../shared/ui/textArea/textArea';
import ClosePopup from '../../widgets/closePopup/closePopup';
import CustomInputFile from '../../shared/ui/customInputFile/customInputFile';
import {
    useAddValuesToLocalStorage,
    useCheckAllForm,
    useGetLocalStateForForms,
    useModal
} from '../../shared/helpers/hooks';
import { showAttention } from '../../shared/helpers/attention';
import Loader from '../../widgets/loader/loader';
import { ERROR_ATTENTION_FOR_FORM } from '../../entities/errors/errors';
import { IInputsForFormAddProfile, IndicatorsForUi, SelectsIndicators } from '../../entities/uiInterfaces/uiInterfaces';
import { ReactComponent as SvgLogo } from '../../assets/svg/uploadLogo.svg';
import { ReactComponent as SvgBanner } from '../../assets/svg/uploadBanner.svg';
import Toggle from '../../shared/ui/checkbox/checkbox';
import { checkProfile, uploadLogo, uploadVideo } from '../../shared/api/request/addProfileThunk/addprofileThunk';
import {CheckUser} from '../../shared/redux/slices/profiles/profilesSchema';
import Portal from "../../shared/ui/portal/portal";
import PreviewBlock from "../modalWindows/previewBlock/previewBlock";

const AddProfile = (props) => {

    const dispatch = useAppDispatch();

    /** STATES*/
    const {
        name,
        is_in_mlm,
        is_incognito,
        logoLink,
        bannerLink,
        tab,
        language,
        hashtags,
        url,
        activity_hobbies,
        coordinates,
        marketingPercent,
        showImageInModalWindow,
        showVideoInModalWindowButton,
    } = useAppSelector((state) => state.formsAddProfile);

    const [imageUrl, setImageUrl] = React.useState<string>('');
    const [videoUrl, setVideoUrl] = React.useState<string>('');

    const { logo, banner, form } = useAppSelector((state) => state.requestAddProfile);
    const { account } = useAppSelector((state) => state.authSlice);
    const {modalPreview, isClosingModalPreview} = useAppSelector((state) => state).modalWindow;
    /** ACTIONS*/
    const { updateField, addIncognito } = formsAddProfileActions;


    /** CUSTOM HOOKS*/
    /** проверка формы перед отправкой*/
    const { validateForm } = useCheckAllForm();
    /** управление модальными окнами*/
    const { openModal, closeModal } = useModal();
    /** сохранение данных с формы в локалсторедже*/
    const { addValueToLocalStorage } = useAddValuesToLocalStorage();

    /** FUNCTIONS
    /** для смены состояния чекбокса */
    const changeIncognito: ForFunc<number, void> = React.useCallback(
        (id) => {
            addValueToLocalStorage('is_incognito', !is_incognito);
            dispatch(addIncognito(!is_incognito));
        },
        [addIncognito, is_incognito]
    );

    /** открыть превью видео*/
    const openPreviewVideo = () => {
        openModal('modalPreview')
    }

    /** универсальная формула для смены состояний полей формы */
    const changeState = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, item: keyof FormsAddProfileSchema): void => {
            if (item === 'hashtags' && !bannerLink) {
                showAttention('To add hashtags, you need to upload a video', 'warning');
                return;
            }
            dispatch(updateField({ name: item, value: e.target.value }));
        },
        [updateField, name, is_in_mlm, is_incognito, logoLink, bannerLink, tab, language, hashtags, url, activity_hobbies, coordinates]
    );

    /** для добавления файлов logo и  video */
    const addFile = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>, item: keyof FormsAddProfileSchema): Promise<void> => {
        const files = e.target.files;
        const file = files[0];
        const url = URL?.createObjectURL(file);

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
                const formData = new FormData();
                formData.append('file', file);
                setImageUrl(url);

                dispatch(uploadLogo(formData));
            } else if (item === BUTTONS_FOR_ADD_PROFILE[1].name) {
                const formData = new FormData();
                formData.append('file', file);
                setVideoUrl(url);
                dispatch(uploadVideo(formData));
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
            .join(',');

        if (result) {
            let adressObject = null;
            let coordinatesObject = null;

            if (coordinates?.length > 0) {
                adressObject = coordinates?.map((item) => `${item.postcode} ${item.street}, ${item.city},`);
                coordinatesObject = coordinates?.map((item) => [item.coordinates[1], item.coordinates[0]]);
            }

            const obj: CheckUser = {
                // profile_data: {
                activity_hobbies: activity_hobbies ?? null,
                adress: adressObject,
                city: coordinates?.[0]?.city ?? null,
                coordinates: coordinatesObject ?? null,
                hashtags: formattedHashtags.split(','),
                is_in_mlm: +is_in_mlm | 30,
                is_incognito: false,
                name: name,
                wallet_number: account,
                website_or_social: url,
                // },
                // image_data: logoLink ? {image_path: logoLink} : null,
                // video_data: bannerLink ? {video_path: bannerLink} : null,
            };
            console.log(obj);
            dispatch(checkProfile(obj));
        }
    };

    const itemList = [{ id: 1, label: 'Public' }];

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverTitle}>
                <div className={cls.coverBlock}>
                    <h3 className={cls.title}>{TITLES.addProfile}</h3>
                </div>
            </div>
            <ClosePopup />
            <div className={cls.bodyBlock}>
                <div className={`${cls.left_block} ${cls.desctop}`}>
                    <CustomInputFile
                        type='file'
                        errorLoaded={Boolean(banner.error)}
                        loadedFile={Boolean(bannerLink)}
                        isLoadingFile={banner.isPending}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => addFile(e, 'banner' as keyof FormsAddProfileSchema)}
                        classNameWrapper={cls.cover_btn_banner}
                    >
                        <div className={cls.cover_btn_banner_text}>
                            <SvgBanner className={cls.svgBanner} />
                            <div className={cls.text_info}>Image or video</div>
                            <div className={cls.maxSize}>9:16</div>
                            {/*{videoUrl && showVideoInModalWindowButton && <video className={cls.loaded_video} src={videoUrl} />}*/}
                        </div>
                    </CustomInputFile>
                    {videoUrl &&
                        <CustomButton onClick={openPreviewVideo} classnameWrapper={cls.wrapper_btn_show_video} classNameBtn={cls.cover_btn_banner} type='button'>video preview</CustomButton>
                    }
                </div>
                <div className={cls.centered_block}>
                    <div className={cls.coverBtns}>
                        <div className={cls.text_center}>
                            <CustomInputFile
                                type='file'
                                errorLoaded={Boolean(logo.error)}
                                loadedFile={Boolean(logoLink)}
                                isLoadingFile={logo.isPending}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => addFile(e, 'logo' as keyof FormsAddProfileSchema)}
                                classNameWrapper={cls.cover_btn_logo}
                            >
                                <div className={cls.cover_btn_banner_text}>
                                    <SvgLogo className={cls.svg_logo} />
                                    <div className={cls.text_info_logo}>Logo</div>
                                </div>
                            </CustomInputFile>
                            <div className={cls.max}>Max 2/3</div>
                        </div>
                        <div className={`${cls.center_block_mobile}`}>
                            <CustomInputFile
                                type='file'
                                errorLoaded={Boolean(banner.error)}
                                loadedFile={Boolean(bannerLink)}
                                isLoadingFile={banner.isPending}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => addFile(e, 'banner' as keyof FormsAddProfileSchema)}
                                classNameWrapper={cls.cover_btn_banner}
                            >
                                <div className={cls.cover_btn_banner_text}>
                                    <SvgBanner className={cls.svgBanner} />
                                    <div className={cls.text_info_logo}>
                                        Image <br /> or <br /> video
                                    </div>
                                </div>
                            </CustomInputFile>
                            <div className={cls.max}>9:16</div>
                        </div>
                    </div>
                    <div className={cls.aboutYou}>
                        {INPUTS_FOR_ADD_PROFILE?.length >= 1 &&
                            INPUTS_FOR_ADD_PROFILE?.map((item: IInputsForFormAddProfile, index) => (
                                <CustomInput
                                    type='text'
                                    classNameWrapper={cls.wraper_head}
                                    classNameInput={cls.input_head}
                                    placeholder={item.label}
                                    key={item.id}
                                    inAppSelector={false}
                                    showLength={true}
                                    onBlur={() => {
                                        const currentValue: string = item.name === 'name' ? name : url;
                                        addValueToLocalStorage(item.name, currentValue);
                                    }}
                                    value={item.name === 'name' ? name : url}
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
                                    placeholder={item.label}
                                    classNameWrapper={cls.wrapper_textarea}
                                    classNameInput={cls.wrapper_textarea_input}
                                    key={item.id}
                                    showLength={true}
                                    inAppSelector={false}
                                    value={item.name === 'activity_hobbies' ? activity_hobbies : hashtags}
                                    onBlur={() => {
                                        const currentValue: string = item.name === 'activity_hobbies' ? activity_hobbies : hashtags;
                                        addValueToLocalStorage(item.name, currentValue);
                                    }}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        changeState(e, item.name as keyof FormsAddProfileSchema)
                                    }
                                />
                            ))}
                    </div>
                </div>
                <div className={cls.right_block}>
                    <Geolocation />
                    <CustomSelect
                        indicator={SelectsIndicators.address}
                        classNameWrapper={cls.wrapper_language}
                        classNameChosenValue={cls.customSelect}
                        options={LANGUAGE_OPTION}
                        placeholder='Choose Language'
                        arrowIndicator={true}
                    />
                    <div className={cls.coverValue}>
                        <div className={cls.mlm_text}>MLM</div>
                        <div className={cls.mlm_percent}>{is_in_mlm}%</div>
                    </div>
                    <Slider />
                    <div className={cls.coverTabs}>
                        {TABS_OPTIONS.length >= 1 &&
                            TABS_OPTIONS.map((item) => (
                                <div key={item.id} className={`${cls.block_mlm} ${item.id === 1 && cls.active}`}>
                                    {Number(+is_in_mlm * item.percent).toFixed(1)}
                                </div>
                            ))}
                    </div>
                    <div className={cls.coverIncognito}>
                        <Toggle itemList={itemList} checked={is_incognito} onChange={changeIncognito} />
                    </div>
                    <div className={cls.coverAddBtn}>
                        <CustomButton
                            onClick={sendForm}
                            type='button'
                            classNameBtn={cls.simple_btn}
                            indicator={IndicatorsForUi.simpleButton}
                        >
                            <div className={cls.textBtnAdd}>
                                <span className={cls.firstSpan}>Add</span>
                                <span className={cls.lastSpan}>for 1000 STT</span>
                            </div>
                        </CustomButton>
                    </div>
                </div>
            </div>
            <Loader isLoading={form?.isPending} />
            <Portal whereToAdd={document.body}>
            <div className={`${cls.wrapper_preview} ${modalPreview ? cls.show : cls.closed}`}>
                <PreviewBlock previewLink={videoUrl} show={modalPreview}
                profile={{
                    profile_data: {
                        id: null,
                        activity_hobbies: activity_hobbies,
                        adress: null,
                        coordinates: null,
                        hashtags: null,
                        is_incognito: null,
                        name: name,
                        url: null,
                        wallet_number: null,
                    },
                    image_data: imageUrl,
                    video_data: videoUrl,
                }}
                />
            </div>
            </Portal>
        </div>
    );
};

export default AddProfile;
