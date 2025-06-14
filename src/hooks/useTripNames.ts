import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const useTripsNames = () => {
  const [tripsNames, setTripsNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTripsNames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/Programes/All-TripsName");
      setTripsNames(response.data || []);
    } catch (err) {
      console.error("Error fetching trips names:", err);
      setError("Failed to fetch trips names");
      // Fallback to empty array or you can import the static array as fallback
      setTripsNames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsNames();
  }, []);

  return {
    tripsNames,
    loading,
    error,
    refetch: fetchTripsNames,
  };
};
