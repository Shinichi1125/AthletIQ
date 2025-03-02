import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error("REACT_APP_API_URL is not defined in environment variables.");
}

export const fetchTrainingData = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
