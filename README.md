# AI Travel Planner

An intelligent travel planning application that generates personalized travel itineraries using AI. The application takes user inputs like destination, dates, budget, and interests to create detailed travel plans including day-by-day itineraries, accommodation suggestions, transportation options, and cost breakdowns.

## Features

- Generate complete travel plans with a single request
- Customized itineraries based on user preferences and interests
- Detailed cost breakdowns in Indian Rupees (₹)
- Responsive UI that works on all devices
- Accommodation and transportation recommendations

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React DatePicker for date selection
- Axios for API requests

### Backend
- FastAPI (Python)
- Google Gemini 1.5 Flash AI model
- Pydantic for data validation
- Uvicorn ASGI server

## Project Structure

```
ai-travel-planner/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json        # Frontend dependencies
│   └── ...
└── backend/                # FastAPI backend application
    ├── app/                # Main application package
    │   ├── api/            # API routes
    │   │   ├── __init__.py # API router initialization
    │   │   └── travel.py   # Travel-related endpoints
    │   ├── services/       # Services
    │   │   ├── __init__.py # Services package init
    │   │   └── ai_service.py # Gemini AI integration
    │   ├── __init__.py     # App package init
    │   ├── main.py         # FastAPI application setup
    │   └── models.py       # Pydantic data models
    ├── run.py              # Application entry point
    └── requirements.txt    # Python dependencies
```

## Getting Started

### Prerequisites

- Node.js and npm (for frontend)
- Python 3.8+ (for backend)
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-travel-planner.git
cd ai-travel-planner
```

2. Set up the backend
```bash
cd backend
pip install -r requirements.txt
# Create a .env file with your GEMINI_API_KEY
```

3. Set up the frontend
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend
```bash
cd backend
python run.py
```

2. Start the frontend
```bash
cd ../frontend
npm run dev
```

3. Open http://localhost:5173 in your browser

## Usage

1. Fill in the travel form with your:
   - Source location
   - Destination
   - Start and end dates
   - Budget
   - Number of travelers
   - Interests

2. Click "Generate Plan" to create your personalized travel itinerary

3. View your plan organized into tabs:
   - Itinerary
   - Accommodations
   - Transportation
   - Cost Breakdown
   - Activities

## Environment Variables

### Backend

Create a `.env` file in the backend directory with:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## License

[MIT License](LICENSE) 