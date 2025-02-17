import React, { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap} from 'react-leaflet';
import L, {LatLngBounds, LatLngTuple} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cls from './map.module.scss';
import CompanyPopup from "../../widgets/CompanyPopup/CompanyPopup";

// Настраиваем пути к иконкам по умолчанию
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

const createBlackCircleMarker = () => {
    return L.divIcon({
        className: cls.black_circle_marker, // Класс для стилизации
        iconSize: [16, 16], // Размер маркера
        iconAnchor: [8, 8], // Точка привязки маркера
    });
};


function LocationMarker() {
    const [position, setPosition] = useState<LatLngTuple | null>(null);
    const [visibleCompanies, setVisibleCompanies] = useState<any[]>([]);
    const map = useMap(); // Получаем объект карты

    // Генерация случайных координат для компаний
    const generateRandomCoordinate = () => {
        const latitude = (Math.random() * 180 - 90).toFixed(6); // Широта от -90 до 90
        const longitude = (Math.random() * 360 - 180).toFixed(6); // Долгота от -180 до 180
        return [parseFloat(latitude), parseFloat(longitude)] as LatLngTuple;
    };

    // const companies = Array.from({ length: 2000 }, (_, index) => ({
    //     name: `Компания ${String.fromCharCode(1040 + (index % 32))}${index + 1}`,
    //     position: generateRandomCoordinate(),
    // }));

    const companies = Array.from({ length: 2000 }, (_, index) => ({
        name: `Компания ${String.fromCharCode(1040 + (index % 32))}${index + 1}`,
        position: generateRandomCoordinate(),
        description: `Описание компании ${index + 1}`,
        address: `Адрес компании ${index + 1}`,
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // URL иконки маркера
    }));


    // Фильтрация точек в пределах видимой области карты
    const filterCompaniesInBounds = (companies: any[], bounds: LatLngBounds) => {
        const southWest = bounds.getSouthWest(); // Левый нижний угол
        const northEast = bounds.getNorthEast(); // Правый верхний угол

        return companies.filter((company) => {
            const [companyLat, companyLon] = company.position;
            return (
                companyLat >= southWest.lat &&
                companyLat <= northEast.lat &&
                companyLon >= southWest.lng &&
                companyLon <= northEast.lng
            );
        });
    };

    // Получение местоположения пользователя
    const getUserPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setPosition([latitude, longitude]);
                map.flyTo([latitude, longitude], map.getZoom()); // Перемещаем карту на местоположение
            });
        }
    };

    useEffect(() => {
        getUserPosition();

        // Слушаем изменения положения карты
        map.on('moveend', () => {
            const bounds = map.getBounds(); // Получаем границы видимой области карты
            const filteredCompanies = filterCompaniesInBounds(companies, bounds);
            setVisibleCompanies(filteredCompanies);
        });

        // Очистка события при размонтировании
        return () => {
            map.off('moveend');
        };
    }, [map]);

//     return (
//         <>
//             {position && <Marker position={position}><Popup>You are here</Popup></Marker>}
//             {visibleCompanies.map((company, index) => (
//                 <Marker key={index} position={company.position}>
//
//                     <Popup>{company.name}</Popup>
//                 </Marker>
//             ))}
//         </>
//     );
// }

return (
    <>
        {position && (
            <Marker position={position}>
                <Popup>Вы здесь</Popup>
            </Marker>
        )}
        {visibleCompanies.map((company, index) => (
            <Marker
                key={index}
                position={company.position}
                icon={createBlackCircleMarker()} // Кастомный маркер
            >
                <Popup>
                    <CompanyPopup
                        name={company.name}
                        description={company.description}
                        address={company.address}
                    />
                </Popup>
            </Marker>
        ))}
    </>
);
}


const Map = () => {
    const centerPosition: LatLngTuple = [51.505, -0.09]; // Центральная позиция карты

    return (
        <MapContainer className={cls.cover_map} center={centerPosition} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default Map;