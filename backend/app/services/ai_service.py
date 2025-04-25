import os
import json
import re
import google.generativeai as genai
from fastapi import HTTPException
from dotenv import load_dotenv
from ..models import TravelRequest

# Load environment variables
load_dotenv()

# Setup API key and configure genai
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Missing GEMINI_API_KEY environment variable")

genai.configure(api_key=api_key)

class AIService:
    @staticmethod
    def generate_travel_plan_prompt(request: TravelRequest) -> str:
        """
        Generate a prompt for the Gemini API based on the travel request.
        """
        return f"""
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
        
        Use Indian Rupees (₹) for all monetary values.
        Important: Respond with ONLY the JSON object. Do not include any additional notes, explanations, or markdown formatting outside the JSON.
        """

    @staticmethod
    def clean_ai_response(response_text: str) -> str:
        """
        Clean up the AI response text to handle common formatting issues.
        """
        # Remove leading/trailing whitespace
        cleaned_text = response_text.strip()
        
        # Remove markdown code block markers if present
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]
        
        # Find the proper JSON content by looking for matching braces
        match = re.search(r'({[\s\S]*})', cleaned_text)
        if match:
            cleaned_text = match.group(1)
        
        return cleaned_text.strip()

    @staticmethod
    async def generate_travel_plan(request: TravelRequest) -> dict:
        """
        Generate a travel plan using the Gemini AI model based on the travel request.
        """
        try:
            # Construct the prompt
            prompt = AIService.generate_travel_plan_prompt(request)
            
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
            
            # Get the text response
            travel_plan_text = response.text
            
            # Clean up the response text
            travel_plan_text = AIService.clean_ai_response(travel_plan_text)
            
            # Parse the JSON
            travel_plan_json = json.loads(travel_plan_text)
            
            # Verify that all required fields are present
            required_fields = [
                "itinerary", 
                "accommodation_suggestions", 
                "transportation_options", 
                "estimated_costs", 
                "activities"
            ]
            
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