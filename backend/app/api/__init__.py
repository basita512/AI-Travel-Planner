from fastapi import APIRouter
from .travel import router as travel_router

# Create main API router
api_router = APIRouter()
 
# Include specific API routers
api_router.include_router(travel_router) 