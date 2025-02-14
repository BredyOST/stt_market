import { IModalWindowStatesSchema } from '../slices/modalWindowStatesSlice/modalWindowStatesSchema';
import { FormsAddProfileSchema } from '../slices/formsAddProfileSlice/formsAddProfileSchema';
import { RequestAddProfileSchema } from '../slices/requestAddProfileSlice/requestAddProfileSchema';
import {LanguageSchema} from "../slices/Language/languageShema";
import {AuthSchemaState} from "../slices/authSlice/authShema";
import {WalletState} from "../slices/walletSlice/walletSchema";

export interface IReduxStore {
    authSlice: AuthSchemaState
    modalWindow: IModalWindowStatesSchema;
    formsAddProfile: FormsAddProfileSchema;
    requestAddProfile: RequestAddProfileSchema;
    Language: LanguageSchema,
    walletSlice: WalletState
}
