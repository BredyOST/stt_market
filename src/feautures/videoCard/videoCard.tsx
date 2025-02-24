import React from 'react';
import { ReactComponent as SvgPlay } from '../../assets/svg/play.svg';
import cls from './videoCard.module.scss';
import { ForFunc } from '../../entities/others';
import { useDispatch } from 'react-redux';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { useModal, useProfile } from '../../shared/helpers/hooks';
import { ProfileInfoType } from '../../shared/redux/slices/profiles/profilesSchema';
import { showAttention } from '../../shared/helpers/attention';

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
    profile?: ProfileInfoType;
    sound?: number;
    resetStates?: number;
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
    sound,
    resetStates,
}: IVideoCard) => {
    const dispatch = useDispatch();

    /** states*/
    const [play, setPlay] = React.useState<boolean>(true);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = React.useState<number>(0);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [isEnded, setIsEnded] = React.useState<boolean>(false);
    const [forPosterUrl, setForPosterUrl] = React.useState('');

    /** управление модальными окнами*/
    const { openModal, closeModal } = useModal();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(percent);
        }
    };

    /** функция */
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
            videoRef.current.play().catch((error) => console.warn('Ошибка воспроизведения:', error));
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
        updateProfileServiceState('isOpen', 'reals');
        updateProfileServiceState('chosenFavouritesIdReals', id);
        openModal('modalReals');
    };

    /** для закрытия попапа*/
    const closeRealsList = () => {
        closeModal('modalReals');
    };

    const setVolume = (sound) => {
        if (videoRef?.current) {
            if (sound === 0) {
                videoRef.current.volume = sound;
            } else if (sound === 100) {
                videoRef.current.volume = sound / 100;
            } else {
                videoRef.current.volume = 0.0;
            }
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    /** ставим на пузу видео и запускаем снова*/
    const playAndStopVideo = () => {
        if (videoRef.current && !isEnded) {
            if (play) {
                videoRef.current.pause();
                setPlay(false);
            } else {
                videoRef.current.play();
                setPlay(true);
            }
        }
    };

    /** для перехода к геолокации*/
    const showPositionThisProfile = (profile: ProfileInfoType) => {
        if (profile?.profile_data?.coordinates?.length == 0 || !profile?.profile_data?.coordinates) {
            showAttention('The coordinates field is not filled in the profile', 'warning');
            return;
        }
        updateProfileServiceState('coordinatesProfileForShowing', profile);
    };

    React.useEffect(() => {
        setVolume(sound);
    }, [sound]);

    // Устанавливаем начальную громкость при монтировании
    React.useEffect(() => {
        setVolume(50); // Начальная громкость 50%
    }, []);

    React.useEffect(() => {
        if (!startPointerEnter) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    setIsVisible(entry.isIntersecting);
                },
                { threshold: 0.5 }
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
                    videoRef.current.play().catch((err) => console.warn('Ошибка воспроизведения:', err));
                } else {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0; // Сбрасываем на начало
                }
            }
        }
    }, [isVisible]);

    React.useEffect(() => {
        const captureThumbnail = () => {
            const video = videoRef.current;
            if (!video) return;

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            video.currentTime = 0.1;
            video.onseeked = () => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                setForPosterUrl(canvas.toDataURL('image/jpeg'));
            };
        };

        if (videoRef.current) {
            videoRef.current.addEventListener('loadeddata', captureThumbnail);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadeddata', captureThumbnail);
            }
        };
    }, [videoUrl]);

    React.useEffect(() => {
        setIsEnded(false);
        setPlay(true);
    }, [resetStates]);

    React.useEffect(() => {
        setIsEnded(false);
        setPlay(true);
    }, []);

    return (
        <div
            className={classNameWrap}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative' }}
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
                onEnded={handleVideoEnd}
                autoPlay={false}
                onClick={playAndStopVideo}
            >
                <source src={videoUrl} type='video/mp4' />
                Your browser does not support the video tag.
            </video>
            {((isHovered && !startPointerEnter) || (!play && !startPointerEnter)) && (
                <div className={cls.progressBarContainer_cover}>
                    <div onClick={handleProgressClick} className={cls.progressBarContainer}>
                        <div className={cls.progressBar} style={{ width: `${progress}%` }} />
                        <div className={cls.progressThumb} style={{ left: `${progress}%` }} />
                    </div>
                    <div className={cls.videoTime}>
                        {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(videoRef.current?.duration || 0)}
                    </div>
                </div>
            )}

            {!startPointerEnter && (
                <CustomButton type='button' onClick={() => showPositionThisProfile(profile)} classNameBtn={cls.profileInfo}>
                    <>
                        <img src={profile?.image_data} className={cls.logo}></img>
                        <div className={cls.text_info}>
                            <h3 className={cls.title}>{profile?.profile_data.name}</h3>
                            <div className={cls.subtitile}>{profile?.profile_data?.activity_hobbies}</div>
                        </div>
                    </>
                </CustomButton>
            )}

            {!startPointerEnter && (
                <CustomButton onClick={closeRealsList} type='button' classNameBtn={cls.logo_out}>
                    STT
                </CustomButton>
            )}

            {isEnded && !startPointerEnter && (
                <CustomButton type='button' onClick={handleReplay} classNameBtn={cls.replayButton}>
                    Повторить
                </CustomButton>
            )}
            {!startPointerEnter && !play && (
                <CustomButton onClick={playAndStopVideo} type='button' classnameWrapper={``} classNameBtn={cls.cover_btn_play}>
                    <SvgPlay className={cls.svg_play} />
                </CustomButton>
            )}
        </div>
    );
};

export default VideoCard;
