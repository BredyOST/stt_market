import { useAppSelector } from '../redux/hooks/hooks';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { formsAddProfileActions } from '../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { FormsAddProfileSchema } from '../redux/slices/formsAddProfileSlice/formsAddProfileSchema';
import {ERROR_ATTENTION_FOR_FORM} from "../../entities/errors/errors";

/** для проверки формы на заполнение полей*/
export const useCheckAllForm = () => {
    const { logoLink, bannerLink, name, url, activity_hobbies, hashtags, coordinates, language, mlm, tab, is_incognito } = useAppSelector(
        (state) => state.formsAddProfile
    );
    // проверка наличия протоколов http, https, или ftp
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    const validateForm = () => {
        if (!name.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.name);
            return false;
        }

        if (!url.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.siteUrl);
            return false;
        }

        if (!urlPattern.test(url)) {
            toast.error(ERROR_ATTENTION_FOR_FORM.noHTTP);
            return false;
        }

        if (!activity_hobbies.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.activity);
            return false;
        }
        if (!hashtags.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.hash);
            return false;
        }
        if (!logoLink) {
            toast.error(ERROR_ATTENTION_FOR_FORM.logo);
            return false;
        }
        if (!bannerLink) {
            toast.error(ERROR_ATTENTION_FOR_FORM.banner);
            return false;
        }
        // if (coordinates.length === 0) {
        //     toast.error(ERROR_ATTENTION_FOR_FORM.geolocation);
        //     return false;
        // }
        if (!coordinates) {
            toast.error(ERROR_ATTENTION_FOR_FORM.geolocation);
            return false;
        }
        if (+mlm <= 1) {
            toast.error(ERROR_ATTENTION_FOR_FORM.mlm);
            return false;
        }

        if (!language) {
            toast.error(ERROR_ATTENTION_FOR_FORM.language);
            return false;
        }
        return true;
    };
    return { validateForm };
};

/** для проверки локалстореджа и добавления данных в поля формы*/
export const useGetLocalStateForForms = () => {
    const dispatch = useDispatch();
    const { updateField } = formsAddProfileActions;

    const checkLocalStorage = () => {
        let storage = localStorage.getItem('formData');
        let data = null;
        if (storage) {
            data = JSON.parse(storage);
        }
        if (data) {
            Object?.keys(data)?.forEach((key) => {
                let value = data[key];
                if (value === 'true') {
                    value = true;
                } else if (value === 'false') {
                    value = false;
                }
                dispatch(updateField({ name: key as keyof FormsAddProfileSchema, value: value }));
            });
        }
    };
    return { checkLocalStorage };
};


/** для добавления данных с инпутов формы в локал сторедж*/
export const useAddValuesToLocalStorage = () => {

    const addValueToLocalStorage = (label: string, value: string | boolean) => {
        let storage = localStorage.getItem('formData');
        let data = storage ? JSON.parse(storage) : {};

        // Создание объекта по умолчанию
        const obj = {
            name: '',
            url: '',
            activity_hobbies: '',
            hashtags: '',
            is_incognito: 'false',
            logoLink: '',
            bannerLink: '',
            coordinates: [],
            marketingPercent: 30,
            mlm: '30',
            language: '',
        };

        let formattedHashtags = null
            if(label === 'hashtags' && typeof value === 'string') {
                formattedHashtags = value.split(',')
                    .map((tag) => tag.trim())
                    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
                    .join(', ');
            }

        if (label in obj) {
            if (data) {
                data[label] = label === 'hashtags' ? formattedHashtags: value;
            } else {
                obj[label] = label === 'hashtags' ? formattedHashtags: value;
                data = obj;
            }
            saveLocalStorage('formData', data);
        } else {
            console.warn(`Label "${label}" is not a valid key.`);
        }
    };

    return {addValueToLocalStorage}

}


export const saveLocalStorage = (key:string, obj:any) => {
    localStorage.setItem(key, JSON.stringify(obj));
}