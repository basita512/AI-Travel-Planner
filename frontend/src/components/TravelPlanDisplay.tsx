import { useState } from 'react';
import { TravelPlan } from '../types/travel';
import { 
  FaPrint, 
  FaBed, 
  FaRoute, 
  FaWallet, 
  FaHiking, 
  FaPlane,
  FaMapMarkedAlt
} from 'react-icons/fa';

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
}

type TabType = 'itinerary' | 'accommodations' | 'transportation' | 'costs' | 'activities';

const TravelPlanDisplay = ({ travelPlan, loading }: TravelPlanDisplayProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-t-[#2563eb] rounded-full animate-spin mb-6"></div>
        <p className="text-gray-600">Planning your dream vacation with AI...</p>
        <p className="text-gray-500 text-sm mt-2">This may take up to 30 seconds</p>
      </div>
    );
  }

  if (!travelPlan) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-[#2563eb]/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
          <FaMapMarkedAlt className="text-4xl text-[#2563eb]" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Ready to plan your trip?</h3>
        <p className="text-gray-600 max-w-md">
          Fill out the form with your travel details, and our AI will generate a personalized travel plan for you.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#2563eb] flex items-center gap-2">
          <FaPlane className="text-[#f97316]" />
          Your Travel Plan
        </h2>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition duration-200 text-gray-700"
        >
          <FaPrint /> Print
        </button>
      </div>

      <div className="flex border-b overflow-x-auto mb-6 scrollbar-hide">
        <TabButton 
          active={activeTab === 'itinerary'} 
          onClick={() => setActiveTab('itinerary')}
          icon={<FaRoute />}
          label="Itinerary"
        />
        <TabButton 
          active={activeTab === 'accommodations'} 
          onClick={() => setActiveTab('accommodations')}
          icon={<FaBed />}
          label="Accommodations"
        />
        <TabButton 
          active={activeTab === 'transportation'} 
          onClick={() => setActiveTab('transportation')}
          icon={<FaPlane />}
          label="Transportation"
        />
        <TabButton 
          active={activeTab === 'costs'} 
          onClick={() => setActiveTab('costs')}
          icon={<FaWallet />}
          label="Costs"
        />
        <TabButton 
          active={activeTab === 'activities'} 
          onClick={() => setActiveTab('activities')}
          icon={<FaHiking />}
          label="Activities"
        />
      </div>

      <div className="overflow-y-auto max-h-[600px] pr-2">
        {activeTab === 'itinerary' && 
          <div>
            <h3 className="text-lg font-medium text-[#1e40af] mb-4">Day by Day Itinerary</h3>
            <div className="space-y-4">
              {travelPlan.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="font-medium text-[#2563eb]">{day.day}: {day.date} {day.title && `- ${day.title}`}</h4>
                  <ul className="mt-2 space-y-1">
                    {day.activities.map((activity, i) => (
                      <li key={i} className="text-gray-700 ml-4 list-disc">{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        }
        
        {activeTab === 'accommodations' && 
          <div>
            <h3 className="text-lg font-medium text-[#1e40af] mb-4">Recommended Accommodations</h3>
            <div className="space-y-4">
              {travelPlan.accommodation_suggestions.map((accommodation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-[#2563eb]">{accommodation.name}</h4>
                    <div>
                      <span className="font-bold">₹{accommodation.price_per_night}</span>
                      <span className="text-xs text-gray-500">/night</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{accommodation.type}</p>
                  {accommodation.description && <p className="mt-2 text-gray-700">{accommodation.description}</p>}
                </div>
              ))}
            </div>
          </div>
        }
        
        {activeTab === 'transportation' && 
          <div>
            <h3 className="text-lg font-medium text-[#1e40af] mb-4">Transportation Options</h3>
            <div className="space-y-4">
              {travelPlan.transportation_options.map((option, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-[#2563eb]">{option.type}</h4>
                    <div className="font-bold">₹{option.estimated_price}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">From {option.from} to {option.to}</p>
                  {option.details && <p className="mt-2 text-gray-700">{option.details}</p>}
                </div>
              ))}
            </div>
          </div>
        }
        
        {activeTab === 'costs' && 
          <div>
            <h3 className="text-lg font-medium text-[#1e40af] mb-4">Cost Breakdown</h3>
            <div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Accommodation</span>
                  <span className="font-bold">₹{travelPlan.estimated_costs.accommodation}</span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Transportation</span>
                  <span className="font-bold">₹{travelPlan.estimated_costs.transportation}</span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Activities</span>
                  <span className="font-bold">₹{travelPlan.estimated_costs.activities}</span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Food</span>
                  <span className="font-bold">₹{travelPlan.estimated_costs.food}</span>
                </div>
                {travelPlan.estimated_costs.miscellaneous && (
                  <div className="flex justify-between p-3 border-b">
                    <span className="text-gray-700">Miscellaneous</span>
                    <span className="font-bold">₹{travelPlan.estimated_costs.miscellaneous}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 mt-2 bg-gray-50 rounded-md">
                  <span className="font-semibold text-gray-800">Total Cost</span>
                  <span className="font-bold text-xl text-[#2563eb]">₹{travelPlan.estimated_costs.total}</span>
                </div>
              </div>
            </div>
          </div>
        }
        
        {activeTab === 'activities' && 
          <div>
            <h3 className="text-lg font-medium text-[#1e40af] mb-4">Recommended Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {travelPlan.activities.map((activity, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h4 className="font-medium text-[#2563eb]">{activity.name}</h4>
                  <span className="inline-block bg-[#f97316]/10 text-[#f97316] text-xs px-2 py-1 rounded-full mt-1">
                    {activity.category}
                  </span>
                  {activity.description && <p className="mt-2 text-sm text-gray-700">{activity.description}</p>}
                </div>
              ))}
            </div>
          </div>
        }
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton = ({ active, onClick, icon, label }: TabButtonProps) => (
  <button
    className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
      active 
        ? 'text-[#2563eb] border-[#2563eb]' 
        : 'text-gray-500 border-transparent hover:text-[#2563eb] hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </button>
);

export default TravelPlanDisplay; 