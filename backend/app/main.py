from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import api_router

# Create FastAPI instance
app = FastAPI(
    title="Travel Planning AI Agent",
    description="API for generating personalized travel plans using AI",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Travel Planning AI Agent API",
        "docs": "/docs",
        "endpoints": {
            "generate_plan": "/travel/generate-plan"
        }
    }

# Include API routes
app.include_router(api_router) 