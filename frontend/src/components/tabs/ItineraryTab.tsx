import { DailyItinerary } from '../../types/travel';
import { FaCalendarDay } from 'react-icons/fa';

interface ItineraryTabProps {
  itinerary: DailyItinerary[];
}

const ItineraryTab = ({ itinerary }: ItineraryTabProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-primary-dark mb-4">Day-by-Day Itinerary</h3>
      
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <FaCalendarDay />
              <h4 className="text-base">Day {day.day}: {day.title || day.date}</h4>
            </div>
            
            <ul className="ml-6 list-disc space-y-2 text-gray-700">
              {day.activities.map((activity, actIndex) => (
                <li key={actIndex}>{activity}</li>
              ))}
            </ul>
            
            {day.meals && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-medium text-sm text-gray-700">Meals:</p>
                <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
                  {day.meals.breakfast && (
                    <div>
                      <span className="font-medium">Breakfast:</span> {day.meals.breakfast}
                    </div>
                  )}
                  {day.meals.lunch && (
                    <div>
                      <span className="font-medium">Lunch:</span> {day.meals.lunch}
                    </div>
                  )}
                  {day.meals.dinner && (
                    <div>
                      <span className="font-medium">Dinner:</span> {day.meals.dinner}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryTab; 