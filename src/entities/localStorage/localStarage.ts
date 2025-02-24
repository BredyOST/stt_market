import { Feature } from '../../shared/redux/slices/formsAddProfileSlice/formsAddProfileSchema';

/** Объект сохранения данных в local Storage с формы заполнения*/
export interface ObjForLocaleStorage {
    name: string;
    url: string;
    activity_hobbies: string;
    hashtags: string;
    is_incognito: boolean;
    logoLink: string;
    bannerLink: string;
    coordinates: Feature[];
    marketingPercent: number;
    mlm: string;
    language: string;
}
