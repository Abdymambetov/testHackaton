import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom Icons for parking
const greenIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios/50/000000/parking.png', // Green parking icon
  iconRetinaUrl: 'https://img.icons8.com/ios/100/000000/parking.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios/50/000000/empty-parking.png', // Red parking icon for full spots
  iconRetinaUrl: 'https://img.icons8.com/ios/100/000000/empty-parking.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icon for user location
const userLocationIcon = new L.Icon({
  iconUrl: 'https://img.icons8.com/ios/50/000000/user-location.png',
  iconRetinaUrl: 'https://img.icons8.com/ios/100/000000/user-location.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Center map component
const CenterMapOnLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 13);
    }
  }, [location, map]);

  return null;
};

// Function to determine the color of the occupancy indicator
const getOccupancyStatus = (availableSpaces, totalSpaces) => {
  const occupancyRate = availableSpaces / totalSpaces;
  if (occupancyRate > 0.5) {
    return 'green'; // Low occupancy
  } else if (occupancyRate > 0.2) {
    return 'yellow'; // Medium occupancy
  } else {
    return 'red'; // High occupancy
  }
};

const MapComponent = () => {
  // Parking spot data with total spaces and available spaces
  const parkingData = [
    {
      id: 1,
      location: 'Центр города, Ул. Киевская',
      latitude: 42.8765,
      longitude: 74.5987,
      totalSpaces: 30,
      availableSpaces: 10,
      isReserved: false, // Whether the spot is reserved
    },
    {
      id: 2,
      location: 'ТЦ "Бишкек Парк"',
      latitude: 42.8715,
      longitude: 74.6037,
      totalSpaces: 30,
      availableSpaces: 0,
      isReserved: false,
    },
    {
      id: 3,
      location: 'Спорткомплекс "Дордой Плаза"',
      latitude: 42.8821,
      longitude: 74.5832,
      totalSpaces: 30,
      availableSpaces: 5,
      isReserved: false,
    },
    {
      id: 4,
      location: 'ТЦ "Вефа Центр"',
      latitude: 42.8598,
      longitude: 74.6102,
      totalSpaces: 30,
      availableSpaces: 0,
      isReserved: false,
    },
    {
      id: 5,
      location: 'Площадь Ала-Тоо',
      latitude: 42.8741,
      longitude: 74.6094,
      totalSpaces: 30,
      availableSpaces: 15,
      isReserved: false,
    },
  ];

  // State for parking spots and user location
  const [parkingSpots, setParkingSpots] = useState(parkingData);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user location using Geolocation API
  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Geolocation Error:', error);
            alert('Unable to fetch user location.');
          }
        );
      }
    };

    fetchUserLocation();
  }, []);

  // Function to book a parking spot
  const reserveSpot = (id) => {
    setParkingSpots((prevSpots) => {
      return prevSpots.map((spot) => {
        if (spot.id === id && !spot.isReserved && spot.availableSpaces > 0) {
          return { ...spot, isReserved: true, availableSpaces: spot.availableSpaces - 1 }; // Reserve the spot
        }
        return spot;
      });
    });
  };

  // Function to release a parking spot
  const releaseSpot = (id) => {
    setParkingSpots((prevSpots) => {
      return prevSpots.map((spot) => {
        if (spot.id === id && spot.isReserved) {
          return { ...spot, isReserved: false, availableSpaces: spot.availableSpaces + 1 }; // Release the spot
        }
        return spot;
      });
    });
  };

  return (
    <MapContainer
      center={[42.8746, 74.5698]} // Default center for Bishkek
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Center the map on user location */}
      {userLocation && <CenterMapOnLocation location={userLocation} />}

      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userLocationIcon}
        >
          <Popup>Вы находитесь здесь</Popup>
        </Marker>
      )}

      {/* Parking Spot Markers */}
      {parkingSpots.map((spot) => {
        const occupancyStatus = getOccupancyStatus(spot.availableSpaces, spot.totalSpaces);
        return (
          <Marker
            key={spot.id}
            position={[spot.latitude, spot.longitude]}
            icon={spot.isReserved ? redIcon : spot.availableSpaces > 0 ? greenIcon : redIcon}
          >
            <Popup>
              <h3>{spot.location}</h3>
              <p>Свободных мест: {spot.availableSpaces}</p>
              <p>Всего мест: {spot.totalSpaces}</p>
              <p>
                Загруженность:
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    backgroundColor: occupancyStatus,
                    borderRadius: '50%',
                    marginLeft: '10px',
                  }}
                ></span>
              </p>
              {spot.isReserved ? (
                <button onClick={() => releaseSpot(spot.id)}>Я выехал</button> // Button to release the spot
              ) : (
                <button onClick={() => reserveSpot(spot.id)}>Забронировать</button> // Button to reserve the spot
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
