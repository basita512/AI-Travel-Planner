from fastapi import APIRouter, HTTPException
from ..models import TravelRequest, TravelPlan
from ..services.ai_service import AIService

# Create router for travel-related endpoints
router = APIRouter(
    prefix="/travel",
    tags=["travel"],
    responses={404: {"description": "Not found"}},
)

@router.post("/generate-plan", response_model=TravelPlan)
async def generate_travel_plan(request: TravelRequest):
    """
    Generate a travel plan based on the provided request details.
    """
    try:
        travel_plan = await AIService.generate_travel_plan(request)
        return travel_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 