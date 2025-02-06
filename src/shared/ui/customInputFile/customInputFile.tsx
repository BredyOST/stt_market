import React, { HTMLAttributes } from 'react';
import cls from '../сustomButton/styled/customButtonStyled.module.scss';
import {IndicatorsForUi} from "../../../entities/uiInterfaces/uiInterfaces";

interface ICustomInputProps extends HTMLAttributes<HTMLInputElement> {
    type: 'file';
    loadedFile: boolean;
    isLoadingFile: boolean;
    indicator?: IndicatorsForUi;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    children?: React.ReactNode;
    errorLoaded: boolean;
    classNameWrapper?:string
}

const CustomInputFile = ({
    indicator,
    loadedFile,
    children,
    onChange,
    type = 'file',
    isLoadingFile,
    errorLoaded,
    classNameWrapper
}: ICustomInputProps) => {

    /** для добавления логотипа и видео*/
    if (indicator === IndicatorsForUi.addBannerToProfile || indicator === IndicatorsForUi.addLogoToProfile || !indicator) {
        return (
            <div className={`${classNameWrapper} ${loadedFile && cls.loaded} ${errorLoaded && cls.errorLoaded}`}>
                <label className={cls.cover}>
                    <input
                        className={cls.hiddenBtn}
                        type={type}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                        multiple
                        disabled={isLoadingFile}
                    />
                    <div>
                        {children}

                        {isLoadingFile && <div>загрузка...</div> }
                        {/*     <div className={cls.text_info}>{indicator === IndicatorsForUi.addLogoToProfile ? 'logo' : 'Image or video'}</div>}*/}
                        {/*{indicator === IndicatorsForUi.addBannerToProfile && <span className={cls.minSize}>9:16</span>}*/}

                    </div>
                </label>
            </div>
        );
    }
    return null;
};

export default CustomInputFile;
