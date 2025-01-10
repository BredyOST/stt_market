import React, { HTMLAttributes } from 'react';
import cls from '../сustomButton/styled/customButtonStyled.module.scss';
import {IndicatorsForUi} from "../../../entities/uiInterfaces/uiInterfaces";

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'file';
    loadedFile: boolean;
    isLoadingFile: boolean;
    indicator: IndicatorsForUi;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    errorLoaded: boolean;
}

const CustomInputFile = ({
    indicator,
    loadedFile,
    children,
    onChange,
    type = 'file',
    isLoadingFile,
    errorLoaded
}: ICustomInputProps) => {

    /** для добавления логотипа и видео*/
    if (indicator === IndicatorsForUi.addBannerToProfile || indicator === IndicatorsForUi.addLogoToProfile) {
        return (
            <div className={`${cls.coverBtnFiles} ${loadedFile && cls.loaded} ${errorLoaded && cls.errorLoaded}`}>
                <label className={cls.customButton}>
                    <input
                        className={cls.hiddenBtn}
                        type={type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        multiple
                        disabled={isLoadingFile}
                    />
                    {children}
                    {isLoadingFile
                        ? <span>загрузка...</span>
                        : <span>{indicator === IndicatorsForUi.addLogoToProfile ? 'logo' : 'banner'}</span>}
                    {indicator === IndicatorsForUi.addBannerToProfile &&<span className={cls.minSize}>9:16</span>}
                </label>

                <div className={cls.maxSize}>{indicator === IndicatorsForUi.addLogoToProfile ? `Max 3 MB` : `Max 15 MB`}</div>
            </div>
        );
    }
    return null;
};

export default CustomInputFile;
