import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL is not defined in environment variables.");
}

export const fetchTrainingData = async (idToken?: string) => {
  const headers: Record<string, string> = {};
  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }
  const response = await axios.get(API_URL, { headers });
  return response.data;
};

export const fetchTrainingDataGuest = async () => {
  const response = await axios.get(`${API_URL}?mode=guest`);
  return response.data;
};
