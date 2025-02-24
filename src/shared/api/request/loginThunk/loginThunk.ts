import { MutationObserver, useMutation } from '@tanstack/react-query';
import { ProfilesApi, queryClient } from '../../api/queryClient';
import { usersActions } from '../../../redux/slices/authorizedInfo/authorizedInfo';
import { IReduxStore } from '../../../redux/config/storeType';

export const loginThunk =
    (wallet: string): any =>
    async (dispatch, getState: () => IReduxStore) => {
        try {
            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['login'],
                mutationFn: ProfilesApi.authorization,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                },
                onSuccess: (data, variables, context) => {
                    const result: any = data?.data;
                    console.log(result);

                    dispatch(usersActions.addUser(result));

                    document.cookie = `tokens=${encodeURIComponent(
                        JSON.stringify({
                            access: result?.tokens?.access_token,
                            refresh: result?.tokens?.refresh_token,
                        })
                    )}; path=/`;
                },
                onSettled: (data, error, variables, context) => {
                    console.log(`rolling back optimistic update with id `);
                },
            }).mutate(wallet);
        } catch (e) {
            console.log(e);
        }
    };

export const useLoginLoading = () =>
    useMutation({
        mutationKey: ['login'],
    }).isPending;
