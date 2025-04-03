export interface TravelRequest {
  source: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  travelers: number;
  interests: string[];
}

export interface DailyItinerary {
  day: number;
  date: string;
  title?: string;
  activities: string[];
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

export interface Accommodation {
  name: string;
  type: string;
  location?: string;
  price_per_night: number;
  total_price?: number;
  amenities?: string[];
  rating?: number;
  description?: string;
}

export interface TransportOption {
  type: string;
  from: string;
  to: string;
  estimated_price: number;
  duration?: string;
  details?: string;
}

export interface CostBreakdown {
  accommodation: number;
  transportation: number;
  activities: number;
  food: number;
  miscellaneous?: number;
  total: number;
}

export interface Activity {
  name: string;
  category: string;
  description?: string;
  location?: string;
  estimated_cost?: number;
  duration?: string;
}

export interface TravelPlan {
  itinerary: DailyItinerary[];
  accommodation_suggestions: Accommodation[];
  transportation_options: TransportOption[];
  estimated_costs: CostBreakdown;
  activities: Activity[];
} 