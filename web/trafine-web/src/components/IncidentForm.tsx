import React, { useState } from "react";
import api from "../api/axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat: number;
  lng: number;
  onClose: () => void;
}

const IncidentForm: React.FC<Props> = ({ lat, lng, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("accident");
  const [severity, setSeverity] = useState("moderate");
  const [image, setImage] = useState<File | null>(null);
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fix for Leaflet marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  function DraggableMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker position={position} draggable />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("severity", severity);
      formData.append("status", "pending");
      formData.append(
        "location",
        JSON.stringify({
          type: "Point",
          coordinates: [position[1], position[0]],
        })
      );
      if (image) {
        formData.append("image", image);
      }

      await api.post("/incidents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onClose();
    } catch (err) {
      console.error("Erreur signalement:", err);
      setError("Échec de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4 text-center">
          Signaler un incident
        </h3>

        {error && (
          <div className="mb-3 text-red-600 text-sm bg-red-100 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="accident">Accident</option>
            <option value="bouchon">Bouchon</option>
            <option value="route_fermée">Route fermée</option>
            <option value="police">Contrôle police</option>
            <option value="obstacle">Obstacle</option>
          </select>

          <select
            className="w-full border px-3 py-2 rounded"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="minor">Mineur</option>
            <option value="moderate">Modéré</option>
            <option value="severe">Sévère</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />

          <div className="h-52">
            <MapContainer
              center={position}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <DraggableMarker />
            </MapContainer>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
