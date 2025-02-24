import { showAttention } from './attention';
import { BUTTONS_FOR_ADD_PROFILE, NEED_AUTH } from '../const/index.const';
import { ERROR_ATTENTION_FOR_FORM } from '../../entities/errors/errors';
import { ForFunc } from '../../entities/others';

/** функция проверки файлов*/
export const handleFileSize = (file: File, item: string) => {
    const sizeLimit = item === BUTTONS_FOR_ADD_PROFILE[0].name ? 3000000 : 15000000;
    const errorMessage =
        item === BUTTONS_FOR_ADD_PROFILE[0].name ? ERROR_ATTENTION_FOR_FORM.maxSizeLogo : ERROR_ATTENTION_FOR_FORM.maxSizeBanner;
    if (file.size >= sizeLimit) {
        showAttention(errorMessage, 'error');
        return false;
    }
    return true;
};

export const lockScroll = () => {
    document.documentElement.classList.add('lock');
};

export const removeLockScroll = () => {
    document.documentElement.classList.remove('lock');
};

export const needToAuth: ForFunc<void, void> = () => {
    showAttention(NEED_AUTH, 'error');
};
