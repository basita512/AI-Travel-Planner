from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TravelRequest(BaseModel):
    source: str
    destination: str
    start_date: str
    end_date: str
    budget: float
    travelers: int
    interests: List[str]
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "source": "Delhi",
                    "destination": "Goa",
                    "start_date": "2023-12-15",
                    "end_date": "2023-12-20",
                    "budget": 50000,
                    "travelers": 2,
                    "interests": ["beaches", "food", "culture"]
                }
            ]
        }
    }

class ActivityItem(BaseModel):
    name: str
    category: str
    description: str

class DailyPlan(BaseModel):
    day: int
    date: str
    title: Optional[str] = None
    activities: List[Dict[str, Any]]

class Accommodation(BaseModel):
    name: str
    type: str
    price_per_night: str
    description: str

class Transportation(BaseModel):
    type: str
    from_location: str = Field(..., alias="from")
    to: str
    estimated_price: str
    details: Optional[str] = None

class CostBreakdown(BaseModel):
    accommodation: str
    transportation: str
    activities: str
    food: str
    miscellaneous: Optional[str] = None
    total: str

class TravelPlan(BaseModel):
    itinerary: List[Dict[str, Any]]
    accommodation_suggestions: List[Dict[str, Any]]
    transportation_options: List[Dict[str, Any]]
    estimated_costs: Dict[str, Any]
    activities: List[Dict[str, Any]] 