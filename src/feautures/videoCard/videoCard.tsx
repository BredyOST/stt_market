import React from "react";
import {ReactComponent as SvgPlay} from "../../assets/svg/play.svg";
import cls from './videoCard.module.scss'
import {ForFunc} from "../../entities/others";
import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {useDispatch} from "react-redux";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";

interface IVideoCard {
    videoUrl: string;
    posterUrl: string;
    classNameWrap: string;
    classNameCover: string;
    muted: boolean;
    controls: boolean;
    startPointerEnter: boolean;
    autoPlay: boolean;
    userId?: number;
    profile?:any
    // key?:number
}

const VideoCard = ({
                       videoUrl,
                       posterUrl,
                       classNameWrap,
                       classNameCover,
                       muted,
                       controls,
                       startPointerEnter,
                       autoPlay,
                       userId,
                        profile,

                   }: IVideoCard) => {

    const dispatch = useDispatch();

    /** states*/
    const [soundOn, setSoundOn] = React.useState<boolean>(true)
    const [play, setPlay] = React.useState<boolean>(true)
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = React.useState<number>(0);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [isEnded, setIsEnded] = React.useState<boolean>(false);

    /** actions*/
    const {addChosenFavouritesIdReals} = authActions

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percent);
        }
    };


    const {openModal, closeModal} = modalAddProfileActions


    /** функция */
    const switchSound: ForFunc<void, void> = () => {
        setSoundOn(prev => !prev);
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newTime = (clickX / rect.width) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (startPointerEnter && videoRef.current && videoRef.current.readyState >= 2) {
            videoRef.current.play().catch(error => console.warn("Ошибка воспроизведения:", error));
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (startPointerEnter && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleVideoEnd = () => {
        setIsEnded(true);
    };

    const handleReplay = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsEnded(false);
        }
    };

    /** для отображения попапа донатов*/
    const openVideo: ForFunc<number, void> = (id: number) => {
        dispatch(addChosenFavouritesIdReals(id))
        const modalReals: string = 'modalReals'
        dispatch(openModal({modalName: modalReals as keyof IModalWindowStatesSchema}))
    }

    /** для закрытия попапа*/
    const closeRealsList = () => {
        const modalRealsList: string = 'modalReals'
        dispatch(closeModal({modalName: modalRealsList as keyof IModalWindowStatesSchema}))
    }

    React.useEffect(() => {
        if (!startPointerEnter) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsVisible(entry.isIntersecting);
                },
                {threshold: 0.5} // Запускается, если хотя бы 50% видео видно
            );

            if (videoRef.current) {
                observer.observe(videoRef.current);
            }

            return () => {
                if (videoRef.current) {
                    observer.unobserve(videoRef.current);
                }
            };
        }

    }, []);

    React.useEffect(() => {
        if (!startPointerEnter) {
            if (videoRef.current) {
                if (isVisible) {
                    videoRef.current.play().catch(err => console.warn("Ошибка воспроизведения:", err));
                } else {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0; // Сбрасываем на начало
                }
            }
        }

    }, [isVisible]);

    const [forPosterUrl, setForPosterUrl] = React.useState("");

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    /** ставим на пузу видео и запускаем снова*/
    const playAndStopVideo = () => {
        if (videoRef.current) {
            if (play) {
                videoRef.current.pause();
                setPlay(false);
            } else {
                videoRef.current.play();
                setPlay(true);
            }
        }
    };

    React.useEffect(() => {
        const captureThumbnail = () => {
            const video = videoRef.current;
            if (!video) return;

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            video.currentTime = 0.1; // Берем кадр на 0.1 секунде
            video.onseeked = () => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setForPosterUrl(canvas.toDataURL("image/jpeg")); // Преобразуем в base64
            };
        };

        if (videoRef.current) {
            videoRef.current.addEventListener("loadeddata", captureThumbnail);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener("loadeddata", captureThumbnail);
            }
        };
    }, [videoUrl]);


    return (
        <div
            className={classNameWrap}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{position: 'relative'}}
            onClick={startPointerEnter ? () => openVideo(userId || 0) : undefined}
        >
            <video
                className={classNameCover}
                src={videoUrl}
                poster={forPosterUrl}
                controls={controls}
                muted={muted}
                ref={videoRef}
                onTimeUpdate={handleTimeUpdate}
                playsInline
                onEnded={() =>setIsEnded(true)}
                autoPlay={false}
                onClick={playAndStopVideo}
            >
                <source src={videoUrl} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>

            {isHovered && !startPointerEnter && (
                <div className={cls.progressBarContainer_cover}>
                    <div onClick={handleProgressClick} className={cls.progressBarContainer}>
                        <div className={cls.progressBar} style={{width: `${progress}%`}}/>
                        <div className={cls.progressThumb} style={{left: `${progress}%`}}/>
                    </div>
                    <div className={cls.videoTime}>
                        {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
                    </div>
                </div>
            )}

            {!startPointerEnter &&
                <div className={cls.profileInfo}>
                    <div className={cls.logo}></div>
                    <div className={cls.text_info}>
                        <h3 className={cls.title}>{profile?.profile_data.name}</h3>
                        <div className={cls.subtitile}>text info about</div>
                    </div>
                </div>
            }
            {!startPointerEnter &&
                <CustomButton  onClick={closeRealsList} type='button' classNameBtn={cls.logo_out}>
                    STT
                </CustomButton>
            }

            {isEnded && !startPointerEnter && (
                <CustomButton type='button' onClick={handleReplay} classNameBtn={cls.replayButton}>
                    Повторить
                </CustomButton>
            )}
            {!startPointerEnter && !play &&
                <CustomButton onClick={playAndStopVideo} type='button' classnameWrapper={``} classNameBtn={cls.cover_btn_play}>
                    <SvgPlay className={cls.svg_play}/>
                </CustomButton>
            }
        </div>
    );
};


export default VideoCard;
