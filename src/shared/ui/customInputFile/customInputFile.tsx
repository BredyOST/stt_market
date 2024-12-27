import React, { HTMLAttributes } from 'react';
import { IButtonsForFormAddProfile, IndicatorsForUi, InputsIndicators } from '../../../entities/IndicatorsForUi';
import cls from '../сustomButton/styled/customButtonStyled.module.scss';

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'file';
    indicator: IndicatorsForUi;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    isLoadingLogo: boolean;
    isLoadingBanner: boolean;
    loadedLogo: string;
    loadedBanner: string;
}

const CustomInputFile = ({
    indicator,
    children,
    onChange,
    type = 'file',
    isLoadingLogo,
    isLoadingBanner,
    loadedLogo,
    loadedBanner,
}: ICustomInputProps) => {
    if (indicator === IndicatorsForUi.addBannerToProfile) {
        return (
            <div className={`${cls.coverBtnFiles} ${loadedLogo && cls.loaded}`}>
                <label className={cls.customButton}>
                    <input
                        className={cls.hiddenBtn}
                        type={type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        multiple
                        disabled={isLoadingLogo}
                    />
                    {children}
                    {isLoadingLogo ? <span>загрузка...</span> : <span>logo</span>}
                </label>
                <div className={cls.maxSize}>Max 3 MB</div>
            </div>
        );
    }
    if (indicator === IndicatorsForUi.addLogoToBanner) {
        return (
            <div className={`${cls.coverBtnFiles} ${loadedBanner && cls.loaded}`}>
                <label className={cls.customButtonSecond}>
                    <input
                        className={cls.hiddenBtn}
                        type={type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        multiple
                        disabled={isLoadingBanner}
                    />
                    {children}
                    <div className={cls.coverText}>
                        {isLoadingBanner ? <span>загрузка...</span> : <span>Banner</span>}
                        <span className={cls.minSize}>9:16</span>
                    </div>
                </label>
                <div className={cls.maxSize}>Max 15 MB</div>
            </div>
        );
    }
    return null;
};

export default CustomInputFile;
