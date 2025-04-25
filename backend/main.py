import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import google.generativeai as genai
import json

# Load environment variables
load_dotenv()

# Setup API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=api_key)

# Create FastAPI instance
app = FastAPI(title="Travel Planning AI Agent")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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

@app.get("/")
async def root():
    return {"message": "Travel Planning AI Agent API"}

@app.post("/generate-plan", response_model=TravelPlan)
async def generate_travel_plan(request: TravelRequest):
    try:
        # Construct the prompt
        prompt = f"""
        Create a detailed travel plan with the following information:
        
        Source: {request.source}
        Destination: {request.destination}
        Dates: {request.start_date} to {request.end_date}
        Budget: ₹{request.budget}
        Number of travelers: {request.travelers}
        Interests: {', '.join(request.interests)}
        
        Please provide:
        1. Day-by-day itinerary
        2. Accommodation suggestions
        3. Transportation options
        4. Cost breakdown
        5. Activity recommendations based on the interests
        
        Format the response as clean structured JSON with the following fields:
        - itinerary: Array of daily plans with 'day', 'date', 'title' (optional), and 'activities' array
        - accommodation_suggestions: Array of places to stay with 'name', 'type', 'price_per_night', and 'description'
        - transportation_options: Array of ways to travel with 'type', 'from', 'to', 'estimated_price', and 'details'
        - estimated_costs: Object with 'accommodation', 'transportation', 'activities', 'food', 'miscellaneous' (optional), and 'total'
        - activities: Array of recommended activities with 'name', 'category', and 'description'
        
        For the cost breakdown:
        - Food costs should be realistic (about ₹500-1000 per person per day)
        - Any remaining budget should be allocated to 'miscellaneous' for shopping, souvenirs, and unexpected expenses
        - Ensure the accommodation costs match the recommended options
        - Make sure all costs add up exactly to the provided budget
        
        Use Indian Rupees (₹) for all monetary values.
        Important: Respond with ONLY the JSON object. Do not include any additional notes, explanations, or markdown formatting outside the JSON.
        """
        
        # Configure the model - using gemini-1.5-flash as specified
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
            }
        )
        
        # Parse the response
        try:
            travel_plan_text = response.text
            
            # Clean up the response to handle common formatting issues
            travel_plan_text = travel_plan_text.strip()
            if travel_plan_text.startswith("```json"):
                travel_plan_text = travel_plan_text[7:]
            if travel_plan_text.endswith("```"):
                travel_plan_text = travel_plan_text[:-3]
            
            # Find the proper JSON end by looking for the closing brace
            # This handles cases where there are additional notes after the JSON
            import re
            match = re.search(r'({[\s\S]*})', travel_plan_text)
            if match:
                travel_plan_text = match.group(1)
            
            travel_plan_text = travel_plan_text.strip()
            
            # No longer needed as currency formatting is handled in frontend
            # travel_plan_text = travel_plan_text.replace("₹₹", "₹")
            
            travel_plan_json = json.loads(travel_plan_text)
            
            # No need for currency normalization as it's handled in frontend
            """
            def normalize_currency(obj):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        if isinstance(value, (dict, list)):
                            normalize_currency(value)
                        elif isinstance(value, str) and "₹" in value:
                            # Remove all rupee symbols first, then add just one at the beginning
                            # This handles cases with multiple ₹ symbols
                            cleaned_value = value.replace("₹", "").strip()
                            # If the value is a currency amount, format it properly
                            obj[key] = f"₹{cleaned_value}"
                        elif key in ["price_per_night", "estimated_price"] and isinstance(value, str):
                            # Special handling for accommodation and transportation prices
                            # For any price field, ensure it has exactly one ₹ symbol at the start
                            cleaned_value = value.replace("₹", "").strip()
                            obj[key] = f"₹{cleaned_value}"
                elif isinstance(obj, list):
                    for item in obj:
                        normalize_currency(item)
                
                # Special handling for accommodation suggestions and transportation options
                if isinstance(obj, dict) and "accommodation_suggestions" in obj:
                    for acc in obj["accommodation_suggestions"]:
                        if isinstance(acc, dict) and "price_per_night" in acc:
                            price = acc["price_per_night"]
                            # Ensure single rupee symbol
                            if isinstance(price, str):
                                acc["price_per_night"] = f"₹{price.replace('₹', '').strip()}"
                
                # Handle transportation options similarly
                if isinstance(obj, dict) and "transportation_options" in obj:
                    for trans in obj["transportation_options"]:
                        if isinstance(trans, dict) and "estimated_price" in trans:
                            price = trans["estimated_price"]
                            # Ensure single rupee symbol
                            if isinstance(price, str):
                                trans["estimated_price"] = f"₹{price.replace('₹', '').strip()}"
                
                # Handle estimated_costs fields
                if isinstance(obj, dict) and "estimated_costs" in obj:
                    cost_fields = ["accommodation", "transportation", "activities", "food", "total"]
                    if "miscellaneous" in obj["estimated_costs"]:
                        cost_fields.append("miscellaneous")
                    
                    for field in cost_fields:
                        if field in obj["estimated_costs"]:
                            value = obj["estimated_costs"][field]
                            if isinstance(value, str):
                                # Ensure single rupee symbol for cost fields
                                obj["estimated_costs"][field] = f"₹{value.replace('₹', '').strip()}"
                
                return obj
            """
            
            # travel_plan_json = normalize_currency(travel_plan_json)
            
            # Verify that the required fields are present
            required_fields = ["itinerary", "accommodation_suggestions", "transportation_options", "estimated_costs", "activities"]
            for field in required_fields:
                if field not in travel_plan_json:
                    raise ValueError(f"Required field '{field}' is missing in the generated travel plan")
            
            return travel_plan_json
            
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Original response: {response.text}")
            raise HTTPException(status_code=500, detail=f"Failed to parse the generated travel plan: {str(e)}")
        
    except Exception as e:
        print(f"Error generating travel plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating travel plan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 