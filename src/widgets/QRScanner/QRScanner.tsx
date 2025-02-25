import React, { useEffect, useRef, useState } from 'react';
import cls from './QRScanner.module.scss';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { ReactComponent as SvgClose } from '../../assets/svg/close.svg';
import { useModal, useProfile } from '../../shared/helpers/hooks';
import { BrowserMultiFormatReader } from '@zxing/library';
import { ethers } from 'ethers';
import { showAttention } from '../../shared/helpers/attention';

const QRScanner = () => {
    const dispatch = useAppDispatch();

    /** STATES */
    const [result, setResult] = useState<string>('');
    const [image, setImage] = useState<string | null>(null);
    const { modalQrScan } = useAppSelector((state) => state.modalWindow);
    const [validateAddress, setValidateAddress] = useState<boolean>(false);
    const { finishedQrScannerSendTokens, finishedQrScannerReals } = useAppSelector((state) => state.userProfiles);

    /** управление модальными окнами */
    const { closeModal, openModal } = useModal();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    /** Реф для видео */
    const videoRef = useRef<HTMLVideoElement>(null);

    /** проверка адреса*/
    async function isValidAddress(adress: string): Promise<void> {
        const input = adress;
        const walletAddress = input.split(':').at(-1).split('@')[0];
        const res = await ethers.isAddress(walletAddress);

        if (res) {
            setValidateAddress(true);
            if (finishedQrScannerSendTokens) {
                updateProfileServiceState('erc20FromQrForSendFrom', String(walletAddress));
                setResult(walletAddress);
                closeModal('modalQrScan');
                openModal('modalSendTokens');
                setResult('');
                setValidateAddress(false);
            } else if (finishedQrScannerReals) {
                updateProfileServiceState('erc20FromQrForSearch', String(walletAddress));
                setResult(walletAddress);
                closeModal('modalQrScan');
                setResult('');
                setValidateAddress(false);
            }
        } else {
            showAttention(`Check the result from the camera; it is not an ERC20 address`, 'error');
        }
    }

    const openModalForContinue = () => {
        if (result && validateAddress) {
            closeModal('modalQrScan');
            if (finishedQrScannerSendTokens) {
                openModal('modalSendTokens');
            } else if (finishedQrScannerReals) {
            }
        }
        setResult('');
        setValidateAddress(false);
    };

    /** Запуск камеры и сканирование QR-кода */
    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().catch((error) => {
                            console.warn('Ошибка при запуске видео:', error);
                        });
                    };
                    codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
                        if (result) {
                            console.log(result);
                            // console.log(result.getText());
                            isValidAddress(result.getText());
                        }
                        if (error) {
                            // showAttention(`Ошибка сканирования:`, 'error')
                            // console.error("Ошибка сканирования:", error);
                        }
                    });
                }
            } catch (error) {
                // showAttention(`Ошибка при доступе к камер`, 'error');
                //
                // console.error("Ошибка при доступе к камере:", error);
            }
        };

        const stopCamera = () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoRef.current.srcObject = null;
            }
        };

        if (modalQrScan) {
            startCamera();
        } else {
            stopCamera();
        }

        return () => {
            codeReader.reset();
            stopCamera();
        };
    }, [modalQrScan]);

    /** для закрытия модального окна */
    const closeModalQr = () => {
        closeModal('modalQrScan');
    };

    /** Обработка загруженного изображения */
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const imageUrl = e.target?.result as string;
                setImage(imageUrl);

                const img = new Image();
                img.src = imageUrl;
                img.onload = async () => {
                    try {
                        const codeReader = new BrowserMultiFormatReader();
                        const result = await codeReader.decodeFromImageElement(img);

                        if (result) {
                            isValidAddress(result.getText());
                        } else {
                            showAttention('Не удалось распознать QR-код на изображении.', 'warning');
                        }
                    } catch (error) {
                        if (error) {
                            showAttention('QR-код не найден на изображении. Попробуйте другой файл.', 'warning');
                        } else {
                            showAttention('Ошибка при распознавании изображения', 'warning');
                            console.error('Ошибка при обработке изображения:', error);
                            setImage(null)
                        }
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    React.useEffect(() => {
        setResult('');
        setValidateAddress(false);
        setImage(null)
    }, []);



    return (
        <div className={cls.wrapper}>
            <CustomButton onClick={closeModalQr} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                <SvgClose className={cls.close_svg} />
            </CustomButton>

            {/*<div className={cls.stt_modal_header}>*/}
            {/*    <div className={cls.notification_header}>QR Scanner</div>*/}
            {/*</div>*/}
            {/*<video className={cls.qr_scanner} ref={videoRef} muted playsInline />*/}
            {/*<input type='file' accept='image/*' onChange={handleFileUpload} />*/}
            {/*{result && validateAddress && <div className={cls.result}>Результат: {result}</div>}*/}
            {/*{result && !validateAddress && <div className={cls.result}>Результат: {result}</div>}*/}
            {/*<CustomButton type='button' onClick={openModalForContinue} classnameWrapper={cls.wrap_btn} classNameBtn={cls.btn_send_tokens}>*/}
            {/*    search*/}
            {/*</CustomButton>*/}
        </div>
    );
};

export default QRScanner;
