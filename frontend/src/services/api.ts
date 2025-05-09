import axios from 'axios';
import { TravelRequest, TravelPlan } from '../types/travel';

// Create an axios instance with baseURL
const api = axios.create({
  baseURL: '/api', // This will be proxied to the backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTravelPlan = async (request: TravelRequest): Promise<TravelPlan> => {
  try {
    // Updated endpoint to match the new backend structure
    const response = await api.post<TravelPlan>('/travel/generate-plan', request);
    
    // Add the traveler count from the request to the response
    return {
      ...response.data,
      travelers: request.travelers
    };
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw error;
  }
};

export default api; 