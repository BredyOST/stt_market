import { IModalWindowStatesSchema } from '../slices/modalWindowStatesSlice/modalWindowStatesShema';
import { FormsAddProfileSchema } from '../slices/formsAddProfileSlice/formsAddProfileSchema';
import { RequestAddProfileSchema } from '../slices/requestAddProfileSlice/requestAddProfileSchema';

export interface IReduxStore {
    modalWindow: IModalWindowStatesSchema;
    formsAddProfile: FormsAddProfileSchema;
    requestAddProfile: RequestAddProfileSchema;
}
