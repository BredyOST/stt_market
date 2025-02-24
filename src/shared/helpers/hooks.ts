import { useAppSelector } from '../redux/hooks/hooks';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { formsAddProfileActions } from '../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { coordinates, FormsAddProfileSchema } from '../redux/slices/formsAddProfileSlice/formsAddProfileSchema';
import { ERROR_ATTENTION_FOR_FORM } from '../../entities/errors/errors';
import { authActions } from '../redux/slices/authSlice/authSlice';
import { modalAddProfileActions } from '../redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { walletActions } from '../redux/slices/walletSlice/walletSlice';
import { AuthSchema } from '../redux/slices/authSlice/authShema';
import { WalletSchema } from '../redux/slices/walletSlice/walletSchema';
import { IModalWindowSchema } from '../redux/slices/modalWindowStatesSlice/modalWindowStatesSchema';
import { profilesActions } from '../redux/slices/profiles/profilesSlice';
import { IProfilesSchema } from '../redux/slices/profiles/profilesSchema';

/** для проверки формы на заполнение полей*/
export const useCheckAllForm = () => {
    const { logoLink, bannerLink, name, url, activity_hobbies, hashtags, coordinates, language, is_in_mlm, tab, is_incognito } =
        useAppSelector((state) => state.formsAddProfile);
    // проверка наличия протоколов http, https, или ftp
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    const validateForm = () => {
        if (!name.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.name);
            return false;
        }

        // if (!url.trim()) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.siteUrl);
        //     return false;
        // }
        //
        if (logoLink.length >= 1 && !urlPattern.test(url)) {
            toast.error(ERROR_ATTENTION_FOR_FORM.noHTTP);
            return false;
        }
        //
        // if (!activity_hobbies.trim()) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.activity);
        //     return false;
        // }
        // if (!hashtags.trim()) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.hash);
        //     return false;
        // }
        if (!logoLink) {
            toast.error(ERROR_ATTENTION_FOR_FORM.logo);
            return false;
        }
        // if (!bannerLink) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.banner);
        //     return false;
        // }
        // if (coordinates.length === 0) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.geolocation);
        //     return false;
        // }
        // if (!coordinates) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.geolocation);
        //     return false;
        // }
        // if (+is_in_mlm <= 1) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.mlm);
        //     return false;
        // }
        //
        // if (!language) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.language);
        //     return false;
        // }
        return true;
    };
    return { validateForm };
};

/** для проверки локалстореджа и добавления данных в поля формы*/
export const useGetLocalStateForForms = () => {
    const dispatch = useDispatch();
    const { updateField } = formsAddProfileActions;
    const { changeAddProfileState } = formsAddProfileActions;

    const checkLocalStorage = () => {
        let storage = localStorage.getItem('formData');
        let data = null;
        if (storage) {
            data = JSON.parse(storage);
        }

        if (data) {
            Object?.keys(data)?.forEach((key) => {
                console.log(key, data[key]);

                let value = data[key];
                if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }
                dispatch(changeAddProfileState({ key: key as keyof FormsAddProfileSchema, value: value }));
                dispatch(updateField({ name: key as keyof FormsAddProfileSchema, value: value }));
            });
        }
    };
    return { checkLocalStorage };
};

/** для добавления данных с инпутов формы в локал сторедж*/
export const useAddValuesToLocalStorage = () => {
    const addValueToLocalStorage = (label: string, value: unknown) => {
        console.log(label, value);

        let storage = localStorage.getItem('formData');
        let data = storage ? JSON.parse(storage) : {};

        // Создание объекта по умолчанию
        const obj = {
            activity_hobbies: '',
            adress: [],
            city: '',
            coordinates: [],
            hashtags: [],
            is_in_mlm: `1`,
            is_incognito: false,
            name: '',
            wallet_number: '',
            url: '',
            logoLink: '',
            bannerLink: '',
            language: '',
        };

        if (label === 'coordinates') {
            if (data) {
                data.adress = Array.isArray(value) && value.map((item: coordinates) => `${item.postcode}, ${item.street}, ${item.city}`);
                data.city = Array.isArray(value) && value[0].city;
                data.coordinates = Array.isArray(value) && value.map((item: coordinates) => [item.coordinates]);
            } else {
                obj.adress = Array.isArray(value) && value.map((item: coordinates) => `${item.postcode}, ${item.street}, ${item.city}`);
                obj.city = Array.isArray(value) && value[0].city;
                obj.coordinates = Array.isArray(value) && value.map((item: coordinates) => [item.coordinates]);
                data = obj;
            }
        }

        if (label === 'language' && typeof value == 'string') {
            if (data) {
                data.language = value;
            } else {
                obj.language = value;
                data = obj;
            }
        }

        if (label === 'url' && typeof value == 'string') {
            if (data) {
                data.url = value;
            } else {
                obj.url = value;
                data = obj;
            }
        }

        if (label === 'activity_hobbies' && typeof value == 'string') {
            if (data) {
                data.activity_hobbies = value;
            } else {
                obj.activity_hobbies = value;
                data = obj;
            }
        }

        if (label === 'image_data' && typeof value == 'string') {
            if (data) {
                data.logoLink = value;
            } else {
                obj.logoLink = value;
                data = obj;
            }
        }

        if (label === 'video_data' && typeof value == 'string') {
            if (data) {
                data.bannerLink = value;
            } else {
                obj.bannerLink = value;
                data = obj;
            }
        }

        if (label === 'is_incognito' && typeof value == 'boolean') {
            if (data) {
                data.is_incognito = value;
            } else {
                obj.is_incognito = value;
                data = obj;
            }
        }

        if (label === 'mlm' && typeof value == 'string') {
            if (data) {
                data.is_in_mlm = value;
            } else {
                obj.is_in_mlm = value;
                data = obj;
            }
        }

        let formattedHashtags = null;
        if (label === 'hashtags' && typeof value === 'string') {
            formattedHashtags = value
                .split(',')
                .map((tag) => tag.trim())
                .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
                .join(', ');
        }

        if (label in obj) {
            if (data) {
                data[label] = label === 'hashtags' ? formattedHashtags : value;
            } else {
                obj[label] = label === 'hashtags' ? formattedHashtags : value;
                data = obj;
            }
        } else {
            console.warn(`Label "${label}" is not a valid key.`);
        }

        // data = obj;
        saveLocalStorage('formData', data);
    };

    return { addValueToLocalStorage };
};

export const saveLocalStorage = (key: string, obj: any) => {
    localStorage.setItem(key, JSON.stringify(obj));
};

/** хук для изменения стейта authSlice*/
export const useAuthState = () => {
    const dispatch = useDispatch();
    const { changeAuthState } = authActions;

    return <K extends keyof AuthSchema>(key: K, value: AuthSchema[K]) => {
        dispatch(changeAuthState({ key: key, value: value }));
    };
};

/** хук для изменения стейта walletSlice*/
export const useWallet = () => {
    const dispatch = useDispatch();
    const { changeWalletSlice } = walletActions;

    return <K extends keyof WalletSchema>(key: K, value: WalletSchema[K]) => {
        dispatch(changeWalletSlice({ key: key, value: value }));
    };
};

/** хук для открытия и закрытия попав*/
export const useModal = () => {
    const dispatch = useDispatch();
    const { openModal, closeModal } = modalAddProfileActions;

    return {
        openModal: (modalName: keyof IModalWindowSchema) => dispatch(openModal({ modalName })),

        closeModal: (modalName: keyof IModalWindowSchema) => dispatch(closeModal({ modalName })),
    };
};

/** хук для изменения стейта profileAnsServicesState*/
export const useProfile = () => {
    const dispatch = useDispatch();
    const { changeProfilesAnSServicesState } = profilesActions;

    return <K extends keyof IProfilesSchema>(key: K, value: IProfilesSchema[K]) => {
        dispatch(changeProfilesAnSServicesState({ key: key, value: value }));
    };
};

/** хук для изменения стейта окна создания профиля*/
export const useAddProfile = () => {
    const dispatch = useDispatch();
    const { changeAddProfileState } = formsAddProfileActions;

    return <K extends keyof FormsAddProfileSchema>(key: K, value: FormsAddProfileSchema[K]) => {
        dispatch(changeAddProfileState({ key: key, value: value }));
    };
};
