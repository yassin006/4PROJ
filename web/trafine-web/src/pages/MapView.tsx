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
import { Circle } from "react-leaflet";
import navLogo from "../assets/logoo1.png";
import userPin from "../assets/broche-de-localisation.png";
import destinationPin from "../assets/epingle.png";
import incidentPin from "../assets/incident.png";

const userIcon = new L.Icon({
  iconUrl: userPin,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -32],
});


const destinationIcon = new L.Icon({
  iconUrl: destinationPin,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const incidentIcon = new L.Icon({
  iconUrl: incidentPin,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const redIcon = destinationIcon;


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
  createdBy: string;
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
  const [destinationDistance, setDestinationDistance] = useState<number | null>(null);
    const [congestionZones, setCongestionZones] = useState<
    { lat: number; lng: number; level: "high" | "medium" }[]
  >([]);

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
if (routeCoords.length > 0) {
  const [destLat, destLng] = routeCoords[routeCoords.length - 1];
  const dist = getDistance(coords, [destLat, destLng]);
  setDestinationDistance(dist);
} else {
  setDestinationDistance(null);
}

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
useEffect(() => {
  fetchCongestionData();
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

  const fetchCongestionData = async () => {
  try {
    const res = await fetch("http://localhost:3000/predictions/congestion", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

const zones = [
  { lat: 45.757813, lng: 4.832011, level: "high" },
  { lat: 45.764043, lng: 4.835659, level: "medium" },
] as const;


    setCongestionZones([...zones]);
  } catch (err) {
    console.error("❌ Failed to load congestion data:", err);
  }
};


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
  
      console.log("🧪 Données brutes recalculate :", response);
  
      let newRoute: [number, number][] = [];
  
      if (typeof response.geometry === "string" && response.geometry.length > 0) {
        const decoded = polyline.decode(response.geometry);
        newRoute = decoded.map(([lat, lng]) => [lat, lng]);
      }
  
      else if (
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
        toast.error("Le tracé détaillé n'est pas disponible.");
      }
    } catch (error) {
      console.error("Erreur lors du recalcul:", error);
      toast.error("Erreur lors du recalcul.");
    }
  };
  
  
  
  const { user } = useAuth(); 


  return (
    <div className="relative h-screen">
      
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
    
    <div className="flex items-center gap-2">
      <img src={navLogo} alt="logo" className="h-8 w-auto" />
    </div>

    <div className="flex items-center gap-8 ml-20 text-sm font-medium text-gray-700">
    <Link
  to="/"
  className="text-gray-700 hover:text-purple-600 hover:underline-offset-2 hover:underline transition"
>
  Carte
</Link>
<Link
  to="/profile"
  className="text-gray-700 hover:text-purple-600 hover:underline-offset-2 hover:underline transition"
>
  Profil
</Link>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
      >
        Déconnexion
      </button>
    </div>
  </div>
</nav>






      <MapContainer center={position} zoom={13} zoomControl={false}  className="h-full w-full z-0 pt-14">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <SetView coords={position} />
        {Array.isArray(routeCoords) && routeCoords.length > 1 && (
          <FitBounds coords={routeCoords} />
        )}

<Marker position={position} icon={userIcon}>

          <Popup>📍 Vous êtes ici</Popup>
        </Marker>
{congestionZones.map((zone, index) => (
  <Circle
    key={index}
    center={[zone.lat, zone.lng]}
    radius={500}
    pathOptions={{
      color: zone.level === "high" ? "red" : "orange",
      fillColor: zone.level === "high" ? "red" : "orange",
      fillOpacity: 0.3,
      weight: 1,
    }}
  />
))}

        {incidents.map((incident) => (
          <Marker icon={incidentIcon}
            key={incident._id}
            position={[
              incident.location.coordinates[1],
              incident.location.coordinates[0],
            ]}
          >
   <Popup>
  <div className="text-sm">
    <strong>{incident.type}</strong>
    <br />
    Statut :{" "}
    <span
      className={`font-bold ${
        incident.status === "validated"
          ? "text-green-600"
          : "text-yellow-600"
      }`}
    >
      {incident.status}
    </span>
    {incident.image && (
      <img
        src={`http://localhost:3000/uploads/incidents/${incident.image}`}
        alt="incident"
        className="mt-2 w-28 h-auto rounded"
      />
    )}

    {user?.userId === incident.createdBy ? (
      <div className="flex justify-center mt-2">
        <button
          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          onClick={async () => {
            try {
              const res = await fetch(
                `http://localhost:3000/incidents/user/${incident._id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );
              if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Erreur de suppression");
              }
              toast.success("🗑️ Incident supprimé !");
              fetchIncidents(position);
            } catch (err: any) {
              toast.error(`Erreur lors de la suppression : ${err.message}`);
            }
          }}
        >
          🗑️ Supprimer
        </button>
      </div>
    ) : (
      incident.status !== "validated" && (
        <div className="flex justify-between mt-2">
          <button
            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
            onClick={async () => {
              try {
                const res = await fetch(
                  `http://localhost:3000/incidents/${incident._id}/validate`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                if (!res.ok) {
                  const error = await res.json();
                  throw new Error(error.message || "Erreur de validation");
                }
                toast.success("✅ Incident validé !");
                fetchIncidents(position);
              } catch (err: any) {
                const msg = err.message;
                if (msg.includes("déjà voté") || msg.includes("already voted")) {
                  toast.error("⚠️ Vous avez déjà voté pour cet incident.");
                } else {
                  toast.error(`❌ Erreur : ${msg}`);
                }
              }
            }}
          >
            ✔ Val
          </button>

          <button
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
            onClick={async () => {
              try {
                const res = await fetch(
                  `http://localhost:3000/incidents/${incident._id}/invalidate`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  }
                );
                if (!res.ok) {
                  const error = await res.json();
                  throw new Error(error.message || "Erreur d'invalidation");
                }
                toast.success("❌ Incident invalidé !");
                fetchIncidents(position);
              } catch (err: any) {
                const msg = err.message;
                if (msg.includes("déjà voté") || msg.includes("already voted")) {
                  toast.error("⚠️ Vous avez déjà voté pour cet incident.");
                } else {
                  toast.error(`❌ Erreur : ${msg}`);
                }
              }
            }}
          >
            ❌ Inval
          </button>
        </div>
      )
    )}
  </div>
</Popup>



          </Marker>
        ))}

        {routeCoords.length > 0 && (
          <>
            <Polyline positions={routeCoords} color="blue" weight={6} />
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
{destinationDistance !== null && (
  <div className="fixed top-[70px] right-4 z-50 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-200 shadow px-4 py-2 rounded-lg text-sm font-medium text-gray-800">
    📍 Distance restante :{" "}
    <span className="font-bold">
      {destinationDistance > 1000
        ? `${(destinationDistance / 1000).toFixed(2)} km`
        : `${Math.round(destinationDistance)} m`}
    </span>
  </div>
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

      {routeCoords.length > 0 && (
        <button
          onClick={handleRecalculate}
          className="fixed bottom-[162px] right-6 z-50 bg-yellow-400 text-white rounded-full w-14 h-14 shadow-lg hover:bg-yellow-500 text-xl flex items-center justify-center"
          title="Recalculer l’itinéraire"
        >
          🔁
        </button>
      )}

      <button
        onClick={() => setShowRouteForm(true)}
        className="fixed bottom-[90px] right-6 z-50 bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-green-700 text-xl flex items-center justify-center"
        title="Itinéraire"
      >
        🚗
      </button>

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-pink-600 text-3xl flex items-center justify-center"
        title="Signaler un incident"
      >
        +
      </button>

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
  className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-amber-200 to-yellow-100 text-gray-800 px-5 py-2.5 rounded-full shadow-lg hover:from-amber-300 hover:to-yellow-200 transition-all duration-300 text-sm font-semibold flex items-center gap-2"
>
  Dashboard
</Link>

)}



    </div>
  );
};

export default MapView;
