import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const usePlacesNames = () => {
  const [placesNames, setPlacesNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlacesNames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/Place/All-PlacesName");
      setPlacesNames(response.data || []);
    } catch (err) {
      console.error("Error fetching places names:", err);
      setError("Failed to fetch places names");
      // Fallback to empty array or you can import the static array as fallback
      setPlacesNames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacesNames();
  }, []);

  return {
    placesNames,
    loading,
    error,
    refetch: fetchPlacesNames,
  };
};
