export type User = {
    id: number;
    profile: null | any;
    favorites: any;
    tokens: {
        access_token: string;
        refresh_token: string;
    };
};

export interface AuthorizedInfoSchema {
    userInfo: User;
    isPending: boolean;
    loginError: any | null;
}
