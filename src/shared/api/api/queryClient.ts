import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';
import { api } from '../axios/axiosInstance/axiosInstance';
import { IProfileUser, WalletAuthorization } from '../axios/dto/dto';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1 * 60 * 1000,
        },
    },
});

/** получение первых 50 профилей*/
export const ProfilesApi = {
    authorization: (wallet: WalletAuthorization) => {
        return api.post<WalletAuthorization>(`/user/login?wallet_number=${wallet}`, {
            headers: { accept: 'application/json' },
        });
    },
    getProfiles: ({ signal }: { signal: AbortSignal }) => {
        return api.get('/profiles', {
            signal,
        });
    },
    getServices: ({ signal }: { signal: AbortSignal }) => {
        return api.get('/services', {
            signal,
        });
    },
    uploadLogo: (formData) => {
        return api.post<any>('/upload_image', formData);
    },
    uploadVideo: (formData) => {
        return api.post<any>('/upload_video', formData);
    },
    checkProfile: (data) => {
        return api.post<any>('/check_form', data);
    },
    saveProfile: (data) => {
        return api.post<any>('/save_profile/', data);
    },
    saveProfileWithoutVideo: (data) => {
        return api.post<any>('/save_profile_without_video', data);
    },
    getQueryOptions: () => {
        return queryOptions({
            queryKey: ['profiles'],
            queryFn: (meta) => ProfilesApi.getProfiles(meta),
        });
    },
};
