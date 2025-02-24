export type WalletAuthorization = string;
export interface IProfileUser {
    id: number;
    profile: {
        id: number;
        created_at: string;
        name: string;
        user_logo_url: string;
        video_url: string;
        preview_url: string;
        activity_and_hobbies: string;
        is_moderated: boolean;
        is_incognito: boolean;
        is_in_mlm: number;
        website_or_social: string;
        is_admin: boolean;
        adress: {};
        city: string;
        coordinates: string;
        followers_count: number;
    } | null;
    favorites: [];
    tokens: {
        access_token: string;
        refresh_token: string;
    };
}
