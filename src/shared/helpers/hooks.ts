import { useAppSelector } from '../redux/hooks/hooks';
import { toast } from 'react-toastify';
import { ERROR_ATTENTION_FOR_FORM } from '../../entities/IndicatorsForUi';
import { useDispatch } from 'react-redux';
import { formsAddProfileActions } from '../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { FormsAddProfileSchema } from '../redux/slices/formsAddProfileSlice/formsAddProfileSchema';

/** для проверки формы на заполнение полей*/
export const useCheckAllForm = () => {
    const { logo, banner, name, url, activity_hobbies, hashtags, geolocation, language, mlm, tab, is_incognito } = useAppSelector(
        (state) => state.formsAddProfile
    );
    const validateForm = () => {
        if (!name.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.name);
            return false;
        }

        if (!url.trim()) {
            toast.error(ERROR_ATTENTION_FOR_FORM.siteUrl);
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
        if (!logo) {
            toast.error(ERROR_ATTENTION_FOR_FORM.logo);
            return false;
        }
        if (!banner) {
            toast.error(ERROR_ATTENTION_FOR_FORM.banner);
            return false;
        }
        if (geolocation.length === 0) {
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
        if(data) {
            Object?.keys(data)?.forEach((key) => {
                dispatch(updateField({ name: key as keyof FormsAddProfileSchema, value: data[key] }));
            });
        }
    };
    return { checkLocalStorage };
};
