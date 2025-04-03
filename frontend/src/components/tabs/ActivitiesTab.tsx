import { Activity } from '../../types/travel';
import { FaMapMarkerAlt, FaClock, FaDollarSign } from 'react-icons/fa';

interface ActivitiesTabProps {
  activities: Activity[];
}

const ActivitiesTab = ({ activities }: ActivitiesTabProps) => {
  // Function to get color for activity category
  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('outdoor') || categoryLower.includes('nature') || categoryLower.includes('hiking'))
      return 'bg-green-100 text-green-800';
    else if (categoryLower.includes('museum') || categoryLower.includes('art') || categoryLower.includes('culture'))
      return 'bg-purple-100 text-purple-800';
    else if (categoryLower.includes('food') || categoryLower.includes('culinary') || categoryLower.includes('dining'))
      return 'bg-orange-100 text-orange-800';
    else if (categoryLower.includes('beach') || categoryLower.includes('water') || categoryLower.includes('ocean'))
      return 'bg-blue-100 text-blue-800';
    else if (categoryLower.includes('shopping') || categoryLower.includes('market'))
      return 'bg-pink-100 text-pink-800';
    else if (categoryLower.includes('adventure') || categoryLower.includes('sport'))
      return 'bg-red-100 text-red-800';
    else if (categoryLower.includes('relax') || categoryLower.includes('spa') || categoryLower.includes('wellness'))
      return 'bg-cyan-100 text-cyan-800';
    
    // Default color
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-primary-dark mb-4">Recommended Activities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((activity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
            <h4 className="text-primary font-medium mb-2">{activity.name}</h4>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                {activity.category}
              </span>
            </div>
            
            {activity.description && (
              <p className="text-gray-700 text-sm mb-3">{activity.description}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              {activity.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{activity.location}</span>
                </div>
              )}
              
              {activity.duration && (
                <div className="flex items-center gap-1">
                  <FaClock className="text-blue-500" />
                  <span>{activity.duration}</span>
                </div>
              )}
              
              {activity.estimated_cost !== undefined && (
                <div className="flex items-center gap-1">
                  <FaDollarSign className="text-green-500" />
                  <span>${activity.estimated_cost}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesTab; 