import { IModalWindowSchema } from '../slices/modalWindowStatesSlice/modalWindowStatesSchema';
import { FormsAddProfileSchema } from '../slices/formsAddProfileSlice/formsAddProfileSchema';
import { RequestAddProfileSchema } from '../slices/requestAddProfileSlice/requestAddProfileSchema';
import { LanguageSchema } from '../slices/Language/languageShema';
import { AuthSchema } from '../slices/authSlice/authShema';
import { WalletSchema } from '../slices/walletSlice/walletSchema';
import { IProfilesSchema } from '../slices/profiles/profilesSchema';
import { AuthorizedInfoSchema } from '../slices/authorizedInfo/authorizedInfoSchema';

export interface IReduxStore {
    authSlice: AuthSchema;
    modalWindow: IModalWindowSchema;
    formsAddProfile: FormsAddProfileSchema;
    requestAddProfile: RequestAddProfileSchema;
    Language: LanguageSchema;
    walletSlice: WalletSchema;
    userProfiles: IProfilesSchema;
    usersInfo: AuthorizedInfoSchema;
}
