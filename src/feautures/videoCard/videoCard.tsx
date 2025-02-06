import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import React from "react";
import {ReactComponent as SvgSoundOn} from "./../../assets/svg/soundOn.svg";
import {ReactComponent as SvgSoundOff} from "./../../assets/svg/soundOffvg.svg";
import {ReactComponent as SvgGenerationLink} from "./../../assets/svg/share.svg";
import {ReactComponent as SvgReceivePayment} from "./../../assets/svg/receivePayment.svg";
import {ReactComponent as SvgFavourite} from "./../../assets/svg/favorites.svg";
import cls from './videoCard.module.scss'
import {ForFunc} from "../../entities/others";

interface IVideoCard {
    videoUrl: string;
    posterUrl: string;
    classNameWrap: string;
    classNameCover: string;
}

const VideoCard = ({videoUrl, posterUrl, classNameWrap, classNameCover, }:IVideoCard) => {

    const [soundOn, setSoundOn] = React.useState<boolean>(true)

    /** функция */
    const switchSound:ForFunc<void, void> = () => {
        setSoundOn(prev => !prev);
    }


    return (
        <div className={classNameWrap}>
            <video
                className={classNameCover}
                src={videoUrl}
                poster={posterUrl}
                controls
                loop
                muted
                autoPlay
            />
            <div className={cls.profileInfo}>
                <div>logo</div>
                <div>
                    <h3>CROCKS</h3>
                    <div>text info abput</div>
                </div>
            </div>
            <div className={cls.btn_cover}>
                <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={`${cls.svg} ${cls.sizePayment}`}><SvgReceivePayment/></CustomButton>
                <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={`${cls.svg} ${cls.sizeSound}`}><SvgSoundOn/></CustomButton>
                <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={`${cls.svg} ${cls.sizeLink}`}><SvgGenerationLink/></CustomButton>
                <CustomButton type='button' classnameWrapper={cls.wrapperSvg} classNameBtn={`${cls.svg} ${cls.sizeFavourite}`}><SvgFavourite/></CustomButton>
            </div>
        </div>
    );
};


export default VideoCard;