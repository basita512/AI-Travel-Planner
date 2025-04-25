import { useState } from 'react';
import TravelForm from './components/TravelForm';
import TravelPlanDisplay from './components/TravelPlanDisplay';
import { TravelPlan } from './types/travel';
import { FaPlaneDeparture, FaGlobeAmericas } from 'react-icons/fa';

function App() {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white shadow-md py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-2">
            <FaGlobeAmericas className="text-2xl text-[#f97316]" />
            <h1 className="text-2xl font-bold">AI Travel Planner</h1>
          </div>
          <p className="text-blue-100 max-w-2xl">
            Personalized travel plans within India generated in seconds using AI. Discover the perfect destinations, accommodations, and activities across India. Enter your details below to get started.
          </p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <TravelForm 
              setTravelPlan={setTravelPlan} 
              setLoading={setLoading} 
            />
          </div>
          <div>
            <TravelPlanDisplay 
              travelPlan={travelPlan} 
              loading={loading} 
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-[#1e293b] text-white py-6 px-4">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className="text-[#f97316]" />
            <span>AI Travel Planner</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 