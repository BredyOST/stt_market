import { MutationObserver } from '@tanstack/react-query';
import { ProfilesApi, queryClient } from '../../api/queryClient';
import { formsAddProfileActions } from '../../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { useAddValuesToLocalStorage } from '../../../helpers/hooks';
import { CheckUser, FormDataUser, FormDataUserWithoutVideo } from '../../../redux/slices/profiles/profilesSchema';
import { showAttention } from '../../../helpers/attention';
import { ethers } from 'ethers';

import { sttAffiliateAddress, tokenContractAbi, tokenContractAbiCb31, tokenContractAddress } from '../../../const/contracts';

import { IReduxStore } from '../../../redux/config/storeType';
import authSlice, { authActions } from '../../../redux/slices/authSlice/authSlice';

export const uploadVideo =
    (formData: any): any =>
    async (dispatch, getState) => {
        try {
            /** сохранение данных с формы в локалсторедже*/
            const { addValueToLocalStorage } = useAddValuesToLocalStorage();

            const { changeAuthState } = authActions;
            const { addLoader } = authActions;

            dispatch(addLoader(true));

            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['video'],
                mutationFn: ProfilesApi.uploadVideo,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                },
                onSuccess: (data, variables, context) => {
                    console.log(data);
                    if (data && data?.status == 200) {
                        const result = data?.data;
                        dispatch(formsAddProfileActions.addBanner(result?.video_path));
                        dispatch(formsAddProfileActions.changeAddProfileState({ key: 'showVideoInModalWindowButton', value: true }));
                        addValueToLocalStorage('video_data', result?.video_path);
                    }
                },
                onSettled: (data, error, variables, context) => {
                    dispatch(changeAuthState({ key: 'textInfo', value: null }));
                    dispatch(addLoader(false));
                },
            }).mutate(formData);
        } catch (e) {
            console.log(e);
        }
    };

export const uploadLogo =
    (formData: any): any =>
    async (dispatch, getState) => {
        try {
            const { addLoader } = authActions;

            dispatch(addLoader(true));

            /** сохранение данных с формы в локалсторедже*/
            const { addValueToLocalStorage } = useAddValuesToLocalStorage();

            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['logo'],
                mutationFn: ProfilesApi.uploadLogo,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                },
                onSuccess: (data, variables, context) => {
                    if (data && data?.status == 200) {
                        const result = data?.data;
                        dispatch(formsAddProfileActions.addLogo(result?.image_path));
                        dispatch(formsAddProfileActions.changeAddProfileState({ key: 'showImageInModalWindow', value: true }));
                        addValueToLocalStorage('image_data', result?.image_path);
                    }
                },
                onSettled: (data, error, variables, context) => {
                    dispatch(addLoader(false));
                },
            }).mutate(formData);
        } catch (e) {
            console.log(e);
        }
    };

export const checkProfile =
    (profile: CheckUser): any =>
    async (dispatch, getState: () => IReduxStore) => {
        try {
            const { changeAuthState } = authActions;
            const { addLoader } = authActions;

            dispatch(changeAuthState({ key: 'textInfo', value: '1/10 Checking profile fields' }));
            dispatch(addLoader(true));

            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['checkProfile'],
                mutationFn: ProfilesApi.checkProfile,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                },
                onSuccess: async (data, variables, context) => {
                    if (data && data?.status == 200) {
                        showAttention('The form data has been successfully processed', 'success');
                        dispatch(
                            changeAuthState({ key: 'textInfo', value: '2/10 The form data has been successfully processed, wait...' })
                        );

                        const DONAT_ADDRESS = process.env.REACT_APP_DONATION_ERC;

                        const { provider, account } = getState().authSlice;

                        const signer = await provider.getSigner();

                        // Контракт токена STT
                        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
                        const contract = new ethers.Contract(sttAffiliateAddress, tokenContractAbiCb31, signer);

                        // Выполняем перевод токенов
                        try {
                            // Получаем decimals для токена
                            const decimals = await contractCommon.decimals();
                            const tokenAmount = ethers.parseUnits(`100`, parseInt(decimals));

                            // Проверяем allowance (разрешение) перед approve
                            const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), DONAT_ADDRESS);
                            console.log('Allowance before approve:', allowanceBefore.toString());

                            // Выполняем approve
                            dispatch(changeAuthState({ key: 'textInfo', value: '3/10 Waiting for approve transaction confirmation' }));
                            const txApprove = await contractCommon.approve(sttAffiliateAddress, tokenAmount);

                            console.log('Approve transaction sent:', txApprove.hash);
                            const receiptApprove = await txApprove.wait();
                            console.log('Approve transaction confirmed:', receiptApprove);

                            dispatch(changeAuthState({ key: 'textInfo', value: '4/10 Approve transaction confirmed' }));

                            // Проверяем allowance после approve
                            const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), DONAT_ADDRESS);
                            console.log('Allowance after approve:', allowanceAfter.toString());

                            // Проверяем баланс подписанта
                            const balance = await contractCommon.balanceOf(await signer.getAddress());
                            console.log('Balance:', balance.toString());

                            dispatch(changeAuthState({ key: 'textInfo', value: '5/10 Transaction sent' }));

                            let tx = await contract.paymentToTheShop(DONAT_ADDRESS, tokenAmount);
                            dispatch(changeAuthState({ key: 'textInfo', value: '6/10 Preparing token transfer' }));
                            showAttention(`Transaction sent`, 'success');
                            const receipt = await tx.wait();
                            console.log('Transaction confirmed:', receipt);
                            dispatch(changeAuthState({ key: 'textInfo', value: '7/10 Transaction confirmed' }));
                            showAttention(`Transaction confirmed:, ${receipt}`, 'success');

                            const {
                                logoLink,
                                bannerLink,
                                coordinates,
                                hashtags,
                                is_incognito,
                                name,
                                url,
                                wallet_number,
                                activity_hobbies,
                                is_in_mlm,
                                language,
                                marketingPercent,
                            } = getState().formsAddProfile;

                            dispatch(changeAuthState({ key: 'textInfo', value: '8/10 Save profiles' }));

                            if (bannerLink?.length >= 1) {
                                let adressObject = null;
                                let coordinatesObject = null;

                                /** добававить # к словам*/
                                const formattedHashtags = hashtags
                                    .split(',')
                                    .map((tag) => tag.trim())
                                    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
                                    .join(',');

                                if (coordinates?.length > 0) {
                                    adressObject = coordinates?.map((item) => `${item.postcode} ${item.street}, ${item.city},`);
                                    coordinatesObject = coordinates?.map((item) => [item.coordinates[1], item.coordinates[0]]);
                                }

                                const obj: FormDataUser = {
                                    profile_data: {
                                        activity_hobbies: activity_hobbies ?? null,
                                        adress: adressObject,
                                        city: coordinates?.[0]?.city ?? null,
                                        coordinates: coordinatesObject ?? null,
                                        hashtags: formattedHashtags.split(','),
                                        is_in_mlm: +is_in_mlm | 30,
                                        is_incognito: false,
                                        name: name,
                                        wallet_number: account,
                                        website_or_social: url,
                                    },
                                    image_data: logoLink ? { image_path: logoLink } : null,
                                    video_data: bannerLink ? { video_path: bannerLink } : null,
                                };
                                console.log(obj);

                                dispatch(saveProfile(obj));
                            } else {
                                let adressObject = null;
                                let coordinatesObject = null;

                                /** добававить # к словам*/
                                const formattedHashtags = hashtags
                                    .split(',')
                                    .map((tag) => tag.trim())
                                    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
                                    .join(',');

                                if (coordinates?.length > 0) {
                                    adressObject = coordinates?.map((item) => `${item.postcode} ${item.street}, ${item.city},`);
                                    coordinatesObject = coordinates?.map((item) => [item.coordinates[1], item.coordinates[0]]);
                                }

                                const obj: FormDataUserWithoutVideo = {
                                    form_data: {
                                        activity_hobbies: activity_hobbies ?? null,
                                        adress: adressObject,
                                        city: coordinates?.[0]?.city ?? null,
                                        coordinates: coordinatesObject ?? null,
                                        is_in_mlm: +is_in_mlm | 30,
                                        is_incognito: false,
                                        name: name,
                                        wallet_number: account,
                                        website_or_social: url,
                                    },
                                    image_data: { image_path: logoLink },
                                };
                                dispatch(saveProfileWithoutVideo(obj));
                            }
                        } catch (error) {
                            showAttention(`Error sending tokens`, 'error');
                            console.error('Error sending tokens:', error);
                        } finally {
                            dispatch(changeAuthState({ key: 'textInfo', value: null }));
                            dispatch(addLoader(false));
                        }
                    }
                },
                onSettled: (data, error, variables, context) => {
                    console.log(`rolling back optimistic update with id `);
                },
            }).mutate(profile);
        } catch (e) {
            console.log(e);
        }
    };

export const saveProfile =
    (profile: FormDataUser): any =>
    async (dispatch, getState) => {
        try {
            const { changeAuthState } = authActions;
            const { addLoader } = authActions;

            dispatch(addLoader(true));
            dispatch(changeAuthState({ key: 'textInfo', value: '9/11 Saving profile...' }));

            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['saveProfile'],
                mutationFn: ProfilesApi.saveProfile,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                    dispatch(addLoader(false));
                },
                onSuccess: (data, variables, context) => {
                    if (data && data?.status == 200) {
                        const result = data?.data;

                        if (result?.message == 'Ваш профиль успешно сохранен и отправлен на модерацию') {
                            dispatch(
                                changeAuthState({
                                    key: 'textInfo',
                                    value: '10/10 Your profile has been successfully saved and sent for moderation',
                                })
                            );
                            showAttention('Your profile has been successfully saved and sent for moderation', 'success');

                            let currentLocal: string = localStorage.getItem('formData');
                            console.log(currentLocal);
                            if (currentLocal) {
                                console.log(currentLocal);
                                localStorage.removeItem('formData');
                            }
                        }
                        console.log(data);
                    }
                },
                onSettled: (data, error, variables, context) => {
                    dispatch(addLoader(false));
                    dispatch(changeAuthState({ key: 'textInfo', value: null }));
                },
            }).mutate(profile);
        } catch (e) {
            console.log(e);
        }
    };

export const saveProfileWithoutVideo =
    (profile: FormDataUserWithoutVideo): any =>
    async (dispatch, getState: () => IReduxStore) => {
        try {
            const { changeAuthState } = authActions;
            const { addLoader } = authActions;
            dispatch(addLoader(true));
            dispatch(changeAuthState({ key: 'textInfo', value: '9/10 Saving profile...' }));

            const mutationResult = await new MutationObserver(queryClient, {
                mutationKey: ['saveProfileWithotVideo'],
                mutationFn: ProfilesApi.saveProfileWithoutVideo,
                onError: (error, variables, context) => {
                    console.log(`error ${error}`);
                },
                onSuccess: (data, variables, context) => {
                    if (data && data?.status == 200) {
                        console.log(data);
                        const result = data?.data;

                        if (result?.message == 'Ваш профиль успешно сохранен и отправлен на модерацию') {
                            dispatch(
                                changeAuthState({
                                    key: 'textInfo',
                                    value: '10/10 Your profile has been successfully saved and sent for moderation',
                                })
                            );
                            showAttention('Your profile has been successfully saved and sent for moderation', 'success');

                            let currentLocal: string = localStorage.getItem('formData');
                            if (currentLocal) {
                                localStorage.removeItem('formData');
                            }
                        }
                    }
                },
                onSettled: (data, error, variables, context) => {
                    dispatch(addLoader(false));
                    dispatch(changeAuthState({ key: 'textInfo', value: null }));
                },
            }).mutate(profile);
        } catch (e) {
            console.log(e);
        }
    };
