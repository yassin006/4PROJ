import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getNearbyIncidents } from "../api/IncidentService";
import IncidentForm from "../components/IncidentForm";
import RouteForm from "../components/RouteForm";
import toast from "react-hot-toast";
import socket, { connectSocket } from "../api/socket";
import { recalculateRoute } from "../api/RouteService";
import polyline from "@mapbox/polyline"; 
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultPosition: [number, number] = [48.8566, 2.3522];

function SetView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 14);
  }, [coords, map]);
  return null;
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 1) {
      const bounds = L.latLngBounds(coords.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
}

type Incident = {
  _id: string;
  type: string;
  status: string;
  image?: string;
  location: {
    coordinates: [number, number];
  };
};

const MapView = () => {
  const [position, setPosition] = useState<[number, number]>(defaultPosition);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const fetchIncidents = async (coords: [number, number]) => {
    try {
      const data = await getNearbyIncidents(coords[0], coords[1]);
      setIncidents(data);
    } catch (err) {
      console.error("❌ Erreur chargement incidents:", err);
    }
  };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(coords);
        fetchIncidents(coords);

        if (
          routeCoords.length > 0 &&
          currentStep < routeCoords.length &&
          instructions[currentStep]
        ) {
          const [targetLat, targetLng] = routeCoords[currentStep];
          const distance = getDistance(coords, [targetLat, targetLng]);

          if (distance < 30) {
            toast.success(`${instructions[currentStep]}`, {
              duration: 6000,
            });
            setCurrentStep((prev) => prev + 1);
          }
        }
      },
      () => fetchIncidents(defaultPosition),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [routeCoords, instructions, currentStep]);

  useEffect(() => {
    connectSocket();
    const handleNewIncident = (newIncident: any) => {
      setIncidents((prev) => [newIncident, ...prev]);
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-fade-in-out" : "hidden"
            } fixed top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999]`}
          >
            🚨 Nouvel incident signalé à proximité !
          </div>
        ),
        { duration: 6000 }
      );
    };
    socket.on("incident:new", handleNewIncident);
    return () => {
      socket.off("incident:new", handleNewIncident);
    };
  }, []);

  function getDistance(
    [lat1, lng1]: [number, number],
    [lat2, lng2]: [number, number]
  ) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const handleRecalculate = async () => {
    try {
      const incident =
        incidents.length > 0
          ? {
              lat: incidents[0].location.coordinates[1],
              lng: incidents[0].location.coordinates[0],
            }
          : null;
  
      if (!incident) {
        toast.error("Aucun incident à éviter pour recalculer l’itinéraire.");
        return;
      }
  
      const response = await recalculateRoute(
        { lat: position[0], lng: position[1] },
        {
          lat: routeCoords[routeCoords.length - 1][0],
          lng: routeCoords[routeCoords.length - 1][1],
        },
        incident
      );
  
      let newRoute: [number, number][] = [];
  
      if (typeof response.geometry === "string") {
        const decoded = polyline.decode(response.geometry);
        newRoute = decoded.map(([lat, lng]) => [lat, lng]);
      } else if (
        Array.isArray(response.newRoute) &&
        response.newRoute.every(
          (p: any) =>
            Array.isArray(p) &&
            typeof p[0] === "number" &&
            typeof p[1] === "number"
        )
      ) {
        newRoute = response.newRoute as [number, number][];
      }
  
      if (newRoute.length > 1) {
        setRouteCoords(newRoute);
        toast.success(response.message || "🔁 Itinéraire recalculé !");
      } else {
        console.error("⚠️ Route reçue mais invalide :", response);
        toast.error("Itinéraire vide ou invalide reçu.");
      }
    } catch (error) {
      console.error("Erreur lors du recalcul:", error);
      toast.error("Erreur lors du recalcul.");
    }
  };
  
  
  const { user } = useAuth(); 

  

  return (
    
    <div className="relative h-screen">
      <MapContainer center={position} zoom={13} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <SetView coords={position} />
        {Array.isArray(routeCoords) && routeCoords.length > 1 && (
          <FitBounds coords={routeCoords} />
        )}

        <Marker position={position}>
          <Popup>📍 Vous êtes ici</Popup>
        </Marker>

        {incidents.map((incident) => (
          <Marker
            key={incident._id}
            position={[
              incident.location.coordinates[1],
              incident.location.coordinates[0],
            ]}
          >
            <Popup>
              <strong>{incident.type}</strong>
              <br />
              Statut : {incident.status}
              <br />
              {incident.image && (
                <img
                  src={`http://localhost:3000/uploads/incidents/${incident.image}`}
                  alt="incident"
                  className="mt-2 w-28 h-auto rounded"
                />
              )}
            </Popup>
          </Marker>
        ))}

        {routeCoords.length > 0 && (
          <>
            <Polyline positions={routeCoords} color="blue" weight={5} />
            <Marker
              position={routeCoords[routeCoords.length - 1]}
              icon={redIcon}
            >
              <Popup>🏁 Destination</Popup>
            </Marker>
          </>
        )}
      </MapContainer>

      {showForm && (
        <IncidentForm
          lat={position[0]}
          lng={position[1]}
          onClose={() => setShowForm(false)}
        />
      )}

      {showRouteForm && (
        <RouteForm
          userPosition={{ lat: position[0], lng: position[1] }}
          onClose={() => {
            setShowRouteForm(false);
            setCurrentStep(0);
          }}
          onRouteCalculated={(coords) => setRouteCoords(coords)}
          onInstructionsReceived={(steps) => setInstructions(steps)}
        />
      )}

      {/* 🟨 Yellow: Recalculer */}
      {routeCoords.length > 0 && (
        <button
          onClick={handleRecalculate}
          className="fixed bottom-[162px] right-6 z-50 bg-yellow-400 text-white rounded-full w-14 h-14 shadow-lg hover:bg-yellow-500 text-xl flex items-center justify-center"
          title="Recalculer l’itinéraire"
        >
          🔁
        </button>
      )}

      {/* 🟩 Green: Itinéraire */}
      <button
        onClick={() => setShowRouteForm(true)}
        className="fixed bottom-[90px] right-6 z-50 bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-green-700 text-xl flex items-center justify-center"
        title="Itinéraire"
      >
        🚗
      </button>

      {/* 🔵 Blue: Signaler un incident */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-pink-600 text-3xl flex items-center justify-center"
        title="Signaler un incident"
      >
        +
      </button>

      {/* 🟥 Red: Quitter la navigation */}
{routeCoords.length > 0 && (
  <button
    onClick={() => {
      setRouteCoords([]);
      setInstructions([]);
      setCurrentStep(0);
      toast("Navigation arrêtée", { icon: "🛑" });
    }}
    className="fixed bottom-[234px] right-6 z-50 bg-red-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-red-700 text-xl flex items-center justify-center"
    title="Quitter la navigation"
  >
    🛑
  </button>
)}

{user?.role === "admin" && (
  <Link
    to="/admin"
    className="fixed bottom-6 left-6 z-50 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
  >
    Dashboard
  </Link>
)}



    </div>
  );
};

export default MapView;
