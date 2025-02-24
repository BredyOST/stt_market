import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L, { LatLngBounds, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cls from './map.module.scss';
import CompanyPopup from '../../widgets/CompanyPopup/CompanyPopup';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import { CoordinatesType, ProfileInfoType } from '../../shared/redux/slices/profiles/profilesSchema';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { useModal, useProfile } from '../../shared/helpers/hooks';

const createBlackCircleMarker = () => {
    return L.divIcon({
        className: cls.black_circle_marker, // Класс для стилизации
        iconSize: [16, 16], // Размер маркера
        iconAnchor: [8, 8], // Точка привязки маркера
    });
};

const createClusterCustomIcon = function (cluster) {
    return L.divIcon({
        html: `<span className={cls.markercluster_count}>${cluster.getChildCount()}</span>`,
        className: cls.markercluster, // Класс для стилизации
        iconSize: L.point(30, 30, true),
        iconAnchor: [8, 8], // Точка привязки маркера
    });
};

function LocationMarker(props) {
    const [position, setPosition] = useState<LatLngTuple | null>(null);
    const [visibleCompanies, setVisibleCompanies] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[] | null>(null);
    const map = useMap();
    const { profilesForShowing, coordinatesProfileForShowing } = useAppSelector((state) => state.userProfiles);

    /** управление модальными окнами*/
    const { openModal, closeModal } = useModal();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    useEffect(() => {
        if (coordinatesProfileForShowing?.profile_data?.coordinates[0]?.value?.length > 0 && map) {
            closeModal('modalReals');
            updateProfileServiceState('saveClosedRealsBeforeShowingOnTheMap', coordinatesProfileForShowing?.profile_data?.id);
            props.ref.current.scrollIntoView({ behavior: 'smooth' });
            const firstCoordinate = coordinatesProfileForShowing?.profile_data?.coordinates[0]?.value;
            map?.flyTo(firstCoordinate, map?.getZoom());
        }
    }, [coordinatesProfileForShowing, map]);

    useEffect(() => {
        const companies = profilesForShowing?.flatMap((item: ProfileInfoType) => {
            return item?.profile_data.coordinates?.map((elem: CoordinatesType) => {
                return {
                    id: item.profile_data.id,
                    name: item?.profile_data?.name,
                    position: elem.value,
                    description: item?.profile_data?.activity_hobbies,
                    address: item?.profile_data?.adress,
                    iconUrl: item?.profile_data?.url,
                };
            });
        });
        setCompanies(companies);
    }, [profilesForShowing]);

    // Фильтрация точек в пределах видимой области карты
    const filterCompaniesInBounds = (companies: any[], bounds: LatLngBounds) => {
        const southWest = bounds.getSouthWest(); // Левый нижний угол
        const northEast = bounds.getNorthEast(); // Правый верхний угол

        return companies?.filter((company) => {
            const [companyLat, companyLon] = company.position;
            return companyLat >= southWest.lat && companyLat <= northEast.lat && companyLon >= southWest.lng && companyLon <= northEast.lng;
        });
    };

    // Получение местоположения пользователя
    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                map.flyTo([latitude, longitude], map.getZoom());
            });
        }
    };

    const calculateDistance = (point1: LatLngTuple, point2: LatLngTuple) => {
        const R = 6371; // Радиус Земли в км
        const dLat = (point2[0] - point1[0]) * (Math.PI / 180);
        const dLon = (point2[1] - point1[1]) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1[0] * (Math.PI / 180)) * Math.cos(point2[0] * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Расстояние в км
    };

    useEffect(() => {
        if (companies && position) {
            const sortedCompanies = companies
                .map((company) => ({ ...company, distance: calculateDistance(position, company.position) }))
                .sort((a, b) => a.distance - b.distance);
            setVisibleCompanies(sortedCompanies);
        } else if (companies) {
            setVisibleCompanies(companies.slice(0, 1));
        }
    }, [companies, position]);

    useEffect(() => {
        getUserPosition();
        // Слушаем изменения положения карты
        map.on('moveend', () => {
            if (companies) {
                // Проверяем, что companies не undefined
                const bounds = map.getBounds(); // Получаем границы видимой области карты
                const filteredCompanies = filterCompaniesInBounds(companies, bounds);
                setVisibleCompanies(filteredCompanies);
            } else {
                console.log('Companies are not yet defined.');
            }
        });

        // Очистка события при размонтировании
        return () => {
            map.off('moveend');
        };
    }, [map, companies]);

    return (
        <>
            {position && (
                <Marker position={position} icon={createBlackCircleMarker()}>
                    <Popup>Вы здесь</Popup>
                </Marker>
            )}
            <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
                {visibleCompanies?.map((company, index) => (
                    <Marker
                        key={index}
                        position={company.position}
                        icon={createBlackCircleMarker()} // Кастомный маркер
                    >
                        <Popup>
                            <div>
                                <CompanyPopup profile={company} />
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </>
    );
}

const Map = () => {
    const centerPosition: LatLngTuple = [55.7558, 37.6173]; // Центральная позиция карты

    const mapRef = React.useRef<HTMLDivElement>(null);

    return (
        <div ref={mapRef}>
            <MapContainer className={cls.cover_map} center={centerPosition} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <LocationMarker ref={mapRef} />
            </MapContainer>
        </div>
    );
};

export default Map;
