
interface RequestState {
    data: any;
    isPending: boolean;
    error: any | null;
}

export interface RequestAddProfileSchema {
    logo: RequestState;
    banner: RequestState;
    form: RequestState;
    transaction: RequestState;
}