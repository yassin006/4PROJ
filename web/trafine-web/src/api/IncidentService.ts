import api from "./axios";

export const getNearbyIncidents = async (lat: number, lng: number) => {
  const res = await api.get(`/incidents/nearby?lat=${lat}&lng=${lng}`);
  return res.data;
};
