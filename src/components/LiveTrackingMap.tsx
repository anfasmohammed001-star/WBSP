import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icons
const workerIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1986/1986937.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    className: 'worker-marker-animate'
});

const customerIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png', // User/Home icon
    iconSize: [36, 36],
    iconAnchor: [18, 18],
});

// Helper component to auto-center map
const RecenterMap = ({ locations }: { locations: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (locations.length > 0) {
            const bounds = L.latLngBounds(locations);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [locations, map]);
    return null;
};

interface LocationCoord {
    lat: number;
    lng: number;
}

interface LiveTrackingMapProps {
    workerLocation: LocationCoord | null;
    customerLocation?: LocationCoord | null;
}

const LiveTrackingMap = ({ workerLocation, customerLocation }: LiveTrackingMapProps) => {
    if (!workerLocation) return (
        <div className="h-full w-full bg-secondary/20 animate-pulse flex items-center justify-center text-muted-foreground">
            Waiting for GPS signal...
        </div>
    );

    const workerPos: [number, number] = [workerLocation.lat, workerLocation.lng];
    const customerPos: [number, number] | null = customerLocation
        ? [customerLocation.lat, customerLocation.lng]
        : null;

    const allPositions = customerPos ? [workerPos, customerPos] : [workerPos];

    return (
        <MapContainer
            center={workerPos}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* The Worker's Marker */}
            <Marker position={workerPos} icon={workerIcon}>
                <Popup>Worker is here</Popup>
            </Marker>

            {/* The Customer's Marker */}
            {customerPos && (
                <>
                    <Marker position={customerPos} icon={customerIcon}>
                        <Popup>You are here</Popup>
                    </Marker>
                    <Polyline
                        positions={[workerPos, customerPos]}
                        color="#2563eb"
                        dashArray="10, 10"
                        weight={3}
                        opacity={0.6}
                    />
                </>
            )}

            {/* Auto-recenter based on movement */}
            <RecenterMap locations={allPositions} />
        </MapContainer>
    );
};

export default LiveTrackingMap;
