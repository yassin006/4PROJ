// src/api/RouteService.ts
import api from "./axios";
import polyline from "@mapbox/polyline";

export const calculateRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  options?: { avoidTolls?: boolean }
) => {
  const res = await api.post("/routes/calculate", { start, end, options });
  return res.data;
};

export const recalculateRoute = async (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  incident: { lat: number; lng: number }
) => {
  const response = await fetch("http://localhost:3000/routes/recalculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end, incident }),
  });

  if (!response.ok) {
    throw new Error("Failed to recalculate route");
  }

  const data = await response.json();

  // ✅ Corriger ici pour produire un tableau de [number, number]
  if (typeof data.geometry === "string") {
    const decoded = polyline.decode(data.geometry);
    data.newRoute = decoded.map(([lat, lng]) => [lat, lng]); // format explicite
  } else if (Array.isArray(data.newRoute)) {
    data.newRoute = data.newRoute.map((p: any) => [p.lat, p.lng]);
  }

  return data;
};
