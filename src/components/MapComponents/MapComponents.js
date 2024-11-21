// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// // import { fetchParkingSpots } from '../services/api';

// // Исправление проблемы с иконкой по умолчанию в Leaflet
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// const MapComponent = () => {
//   const [parkingSpots, setParkingSpots] = useState([]);

// //   useEffect(() => {
// //     const loadParkingSpots = async () => {
// //       try {
// //         const response = await fetchParkingSpots();
// //         setParkingSpots(response.data);
// //       } catch (error) {
// //         console.error('Failed to fetch parking spots:', error);
// //       }
// //     };

// //     loadParkingSpots();
// //   }, []);

//   return (
//     <MapContainer
//     //   center={[42.8746, 74.5698]} // Центр карты - Бишкек
//       center={[42.8765, 74.5903]} // Центр карты - Бишкек
//       zoom={13}
//       style={{ height: '100vh', width: '100%' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       {parkingSpots.map((spot) => (
//         <Marker
//           key={spot.id}
//           position={[spot.latitude, spot.longitude]}
//         >
//           <Popup>
//             <h3>{spot.location}</h3>
//             <p>{spot.is_available ? 'Available' : 'Occupied'}</p>
//           </Popup>
//         </Marker>
//       ))}
//     </MapContainer>
//   );
// };

// export default MapComponent;

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { fetchParkingSpots } from '../services/api';

// Исправление проблемы с иконкой по умолчанию в Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Создаем зеленую и красную иконки для парковок
const greenIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-green.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-green-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Создаем кастомную иконку для местоположения пользователя
const userLocationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-blue.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-blue-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Компонент для центрирования карты на местоположении пользователя
const CenterMapOnLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 13);
    }
  }, [location, map]);

  return null;
};

const MapComponent = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Функция для получения координат пользователя
  useEffect(() => {
    const fetchUserLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('User location:', position.coords.latitude, position.coords.longitude);
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              // Улучшенная обработка ошибок
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  console.error('User denied the request for Geolocation.');
                  alert('Please allow access to your location in your browser settings.');
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.error('Location information is unavailable.');
                  alert('Unable to retrieve location information. Please try again.');
                  break;
                case error.TIMEOUT:
                  console.error('The request to get user location timed out.');
                  alert('The request for your location timed out. Please try again.');
                  break;
                case error.UNKNOWN_ERROR:
                  console.error('An unknown error occurred.');
                  alert('An unknown error occurred while trying to get your location.');
                  break;
                default:
                  console.error('Error fetching geolocation:', error);
              }
            },
            {
              enableHighAccuracy: true, // Использовать более точное местоположение
              timeout: 10000,           // Максимальное время ожидания (10 секунд)
              maximumAge: 0,            // Не использовать кэшированное местоположение
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          alert('Geolocation is not supported by your browser.');
        }
      };
      

    fetchUserLocation();
  }, []);

  // Загрузка парковочных мест из API
//   useEffect(() => {
//     const loadParkingSpots = async () => {
//       try {
//         const response = await fetchParkingSpots();
//         setParkingSpots(response.data);
//       } catch (error) {
//         console.error('Failed to fetch parking spots:', error);
//       }
//     };

//     loadParkingSpots();
//   }, []);

  return (
    <MapContainer
      center={[42.8746, 74.5698]} // Центр карты по умолчанию — Бишкек
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Центрирование карты на местоположении пользователя */}
      {userLocation && <CenterMapOnLocation location={userLocation} />}

      {/* Маркер местоположения пользователя */}
      {userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userLocationIcon}
        >
          <Popup>Вы находитесь здесь</Popup>
          
        </Marker>
        
      )}

      {/* Маркеры парковочных мест */}
      {parkingSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={spot.is_available ? greenIcon : redIcon}
        >
          <Popup>
            <h3>{spot.location}</h3>
            <p>{spot.is_available ? 'Available' : 'Occupied'}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
