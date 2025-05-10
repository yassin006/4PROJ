import React, { useState } from "react";
import { calculateRoute } from "../api/RouteService";
import polyline from "@mapbox/polyline";

interface Props {
  userPosition: { lat: number; lng: number };
  onClose: () => void;
  onRouteCalculated: (coords: [number, number][]) => void;
  onInstructionsReceived: (instructions: string[]) => void; 
}

const RouteForm: React.FC<Props> = ({
  userPosition,
  onClose,
  onRouteCalculated,
  onInstructionsReceived,
}) => {
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=fr&limit=1&q=${encodeURIComponent(
        destination
      )}`;

      const res = await fetch(nominatimUrl, {
        headers: {
          "User-Agent": "trafine-map-client",
          "Accept-Language": "fr",
        },
      });

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError("Adresse introuvable.");
        setLoading(false);
        return;
      }

      const end = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };

      const result = await calculateRoute(userPosition, end);

      if (!result?.geometry || typeof result.geometry !== "string") {
        setError("Le tracé détaillé n’est pas disponible.");
        setLoading(false);
        return;
      }

      const leafletCoords: [number, number][] = polyline.decode(result.geometry);
      onRouteCalculated(leafletCoords);
      onInstructionsReceived(result.instructions || []);
      onClose();
    } catch (err) {
      console.error("💥 Erreur de calcul :", err);
      setError("Erreur de calcul d'itinéraire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">
          Calculer un itinéraire
        </h3>

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="ex : 29 rue Paul Langevin, Vénissieux"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Calcul..." : "Afficher l’itinéraire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RouteForm;
