import React from 'react';
import {useModal} from "../../../shared/helpers/hooks";
import cls from "./previewBlock.module.scss";
import CustomButton from "../../../shared/ui/сustomButton/CustomButton";
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import VideoCard from "../../videoCard/videoCard";
import {ForFunc} from "../../../entities/others";
import { ReactComponent as SvgSoundOff } from './../../../assets/svg/soundOffvg.svg';
import { ReactComponent as SvgSoundOn } from './../../../assets/svg/sounOn.svg';
import { ReactComponent as SvgGenerationLink } from '../../../assets/svg/share.svg';
import { ReactComponent as SvgReceivePayment } from './../../../assets/svg/receivePayment.svg';
import { ReactComponent as SvgFavourite } from '../../../assets/svg/favorites.svg';
import { ReactComponent as SvgChain } from './../../../assets/svg/chainLink.svg';
import {useAppSelector} from "../../../shared/redux/hooks/hooks";
import {ProfileInfoType} from "../../../shared/redux/slices/profiles/profilesSchema";

interface IPreviewBlockProps {
    show:boolean
    previewLink?:string
    profile:ProfileInfoType
}

const PreviewBlock = ({
                          show,
                          previewLink,
                          profile
}:IPreviewBlockProps) => {

    /** states */
    const [hideMenu, setHideMenu] = React.useState<boolean>(false);
    const [value, setValue] = React.useState<number>(0);

    /** управление модальными окнами*/
    const { openModal, closeModal } = useModal();

    /** для закрытия попапа*/
    const closeRealsList = () => {
        closeModal('modalPreview');
    };


    return (
        <div className={`${cls.overlay} ${show && cls.open}`}>
            <CustomButton onClick={closeRealsList} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn}
                          type='button'>
                <SvgClose className={cls.close_svg}/>
            </CustomButton>
            <div className={cls.body}>
                <div className={cls.item_video_cover}>
                    <VideoCard
                        classNameWrap={cls.item_video}
                        classNameCover={cls.video}
                        videoUrl={previewLink}
                        posterUrl={''}
                        muted={true}
                        controls={false}
                        startPointerEnter={false}
                        autoPlay={true}
                        profile={profile}
                        sound={value}
                        // resetStates={currentSlide}
                    />
                    <div className={cls.btn_cover_block}>
                        <div className={`${cls.basic} ${!hideMenu ? cls.show : cls.hide}`}>
                            <CustomButton
                                type='button'
                                classnameWrapper={cls.wrapperSvg}
                                classNameBtn={``}
                            >
                                <SvgChain className={`${cls.svg} ${cls.sizeChain}`}/>
                            </CustomButton>
                            <CustomButton
                                type='button'
                                classnameWrapper={cls.wrapperSvg}
                                classNameBtn={``}
                            >
                                <SvgReceivePayment className={`${cls.svg} ${cls.sizePayment}`}/>
                            </CustomButton>
                            <CustomButton
                                type='button'
                                classnameWrapper={cls.wrapperSvg}
                                classNameBtn={``}
                            >
                                <>
                                    {value === 0 && <SvgSoundOff className={`${cls.svg} ${cls.sizeSound}`}/>}
                                    {value === 100 && <SvgSoundOn className={`${cls.svg} ${cls.sizeSound}`}/>}
                                </>
                            </CustomButton>
                            <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={``}>
                                <SvgGenerationLink className={`${cls.svg} ${cls.sizeLink}`}/>
                            </CustomButton>
                            <div className={cls.cover_btn_followers}>
                                <CustomButton
                                    type='button'
                                    classnameWrapper={cls.wrapperSvg}
                                    classNameBtn={``}
                                >
                                    <SvgFavourite className={`${cls.svg} ${cls.sizeFavourite}`}/>
                                </CustomButton>
                                <div className={cls.followers}>1000</div>
                            </div>
                        </div>
                        <CustomButton
                            type='button'
                            classnameWrapper={cls.wrapperSvg}
                            classNameBtn={`${cls.svg}`}
                        >
                            <div className={!hideMenu ? cls.expand_icon_show : cls.expand_icon_hide}></div>
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewBlock;