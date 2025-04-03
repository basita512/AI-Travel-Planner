import { Accommodation } from '../../types/travel';
import { FaStar, FaWifi, FaSwimmingPool, FaUtensils } from 'react-icons/fa';

interface AccommodationsTabProps {
  accommodations: Accommodation[];
}

const AccommodationsTab = ({ accommodations }: AccommodationsTabProps) => {
  // Helper function to render accommodation amenities with icons
  const renderAmenities = (amenities: string[] | undefined) => {
    if (!amenities || amenities.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {amenities.map((amenity, index) => {
          let icon = null;
          
          // Match common amenities with icons
          if (amenity.toLowerCase().includes('wifi')) icon = <FaWifi />;
          else if (amenity.toLowerCase().includes('pool')) icon = <FaSwimmingPool />;
          else if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('breakfast')) 
            icon = <FaUtensils />;
            
          return (
            <span key={index} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
              {icon}
              {amenity}
            </span>
          );
        })}
      </div>
    );
  };

  // Render stars for ratings
  const renderRating = (rating: number | undefined) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar 
          key={i}
          className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
        />
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        {stars}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-primary-dark mb-4">Recommended Accommodations</h3>
      
      <div className="space-y-4">
        {accommodations.map((accommodation, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
            <div className="flex justify-between">
              <h4 className="text-primary font-medium text-lg">{accommodation.name}</h4>
              <div className="text-right">
                <p className="font-bold text-lg">${accommodation.price_per_night}<span className="text-sm font-normal text-gray-600">/night</span></p>
                {accommodation.total_price && (
                  <p className="text-sm text-gray-600">Total: ${accommodation.total_price}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-8 gap-y-2 mt-2 text-sm text-gray-600">
              <div>{accommodation.type}</div>
              {accommodation.location && <div>{accommodation.location}</div>}
              {renderRating(accommodation.rating)}
            </div>
            
            {accommodation.description && (
              <p className="mt-3 text-gray-700">{accommodation.description}</p>
            )}
            
            {renderAmenities(accommodation.amenities)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationsTab; 