import { TransportOption } from '../../types/travel';
import { 
  FaPlane, 
  FaTrain, 
  FaCar, 
  FaBus, 
  FaShip, 
  FaTaxi, 
  FaWalking, 
  FaBicycle, 
  FaClock,
  FaDollarSign
} from 'react-icons/fa';

interface TransportationTabProps {
  transportation: TransportOption[];
}

const TransportationTab = ({ transportation }: TransportationTabProps) => {
  // Get the appropriate icon for each transport type
  const getTransportIcon = (type: string) => {
    const lowercaseType = type.toLowerCase();
    
    if (lowercaseType.includes('plane') || lowercaseType.includes('flight') || lowercaseType.includes('air'))
      return <FaPlane className="text-blue-500" />;
    else if (lowercaseType.includes('train') || lowercaseType.includes('rail'))
      return <FaTrain className="text-purple-600" />;
    else if (lowercaseType.includes('car') || lowercaseType.includes('rental') || lowercaseType.includes('drive'))
      return <FaCar className="text-red-500" />;
    else if (lowercaseType.includes('bus') || lowercaseType.includes('coach'))
      return <FaBus className="text-green-600" />;
    else if (lowercaseType.includes('boat') || lowercaseType.includes('ferry') || lowercaseType.includes('cruise'))
      return <FaShip className="text-cyan-600" />;
    else if (lowercaseType.includes('taxi') || lowercaseType.includes('cab') || lowercaseType.includes('uber'))
      return <FaTaxi className="text-yellow-500" />;
    else if (lowercaseType.includes('walk'))
      return <FaWalking className="text-gray-600" />;
    else if (lowercaseType.includes('bike') || lowercaseType.includes('bicycle') || lowercaseType.includes('cycle'))
      return <FaBicycle className="text-orange-500" />;
      
    // Default
    return <FaPlane className="text-blue-500" />;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-primary-dark mb-4">Transportation Options</h3>
      
      <div className="space-y-4">
        {transportation.map((transport, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-full">
                {getTransportIcon(transport.type)}
              </div>
              
              <div className="flex-grow">
                <h4 className="text-primary font-medium">{transport.type}</h4>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>{transport.from}</span>
                  <span>→</span>
                  <span>{transport.to}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold flex items-center justify-end gap-1">
                  <FaDollarSign className="text-green-600" />
                  {transport.estimated_price}
                </div>
                {transport.duration && (
                  <div className="text-sm text-gray-600 flex items-center justify-end gap-1">
                    <FaClock className="text-gray-400" />
                    {transport.duration}
                  </div>
                )}
              </div>
            </div>
            
            {transport.details && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-700">
                {transport.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportationTab; 