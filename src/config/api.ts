//export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://api.slsq.au";

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("slsq-token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};
