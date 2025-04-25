import { CostBreakdown } from '../../types/travel';
import { FaBed, FaPlane, FaUtensils, FaHiking, FaEllipsisH } from 'react-icons/fa';

interface CostsTabProps {
  costs: CostBreakdown;
}

const CostsTab = ({ costs }: CostsTabProps) => {
  // Helper function to extract numeric value from string with rupee symbol
  const getNumericValue = (value: string): number => {
    return parseFloat(value.replace('₹', '').replace(/,/g, ''));
  };

  // Calculate the percentage for each category
  const calculatePercentage = (value: string) => {
    const numericValue = getNumericValue(value);
    const totalValue = getNumericValue(costs.total);
    return ((numericValue / totalValue) * 100).toFixed(1);
  };

  // Colors for categories
  const colors = {
    accommodation: 'bg-blue-500',
    transportation: 'bg-purple-500',
    activities: 'bg-green-500',
    food: 'bg-orange-500',
    miscellaneous: 'bg-gray-500',
  };

  // Icons for categories
  const getIcon = (category: string) => {
    switch (category) {
      case 'accommodation':
        return <FaBed className="text-blue-500" />;
      case 'transportation':
        return <FaPlane className="text-purple-500" />;
      case 'activities':
        return <FaHiking className="text-green-500" />;
      case 'food':
        return <FaUtensils className="text-orange-500" />;
      default:
        return <FaEllipsisH className="text-gray-500" />;
    }
  };

  // Create cost items
  const costItems = [
    { key: 'accommodation', label: 'Accommodation', value: costs.accommodation },
    { key: 'transportation', label: 'Transportation', value: costs.transportation },
    { key: 'activities', label: 'Activities', value: costs.activities },
    { key: 'food', label: 'Food', value: costs.food },
  ];

  if (costs.miscellaneous) {
    costItems.push({ 
      key: 'miscellaneous', 
      label: 'Miscellaneous', 
      value: costs.miscellaneous 
    });
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-primary-dark mb-4">Cost Breakdown</h3>
      
      <div className="space-y-6">
        {/* Bar chart */}
        <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden flex">
          {costItems.map((item) => (
            <div 
              key={item.key}
              className={`${colors[item.key as keyof typeof colors]} h-full`}
              style={{ width: `${calculatePercentage(item.value)}%` }}
              title={`${item.label}: ${item.value} (${calculatePercentage(item.value)}%)`}
            ></div>
          ))}
        </div>
        
        {/* Cost items breakdown */}
        <div className="space-y-3">
          {costItems.map((item) => (
            <div key={item.key} className="flex justify-between items-center p-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {getIcon(item.key)}
                </div>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-semibold">{item.value}</div>
                <div className="text-sm text-gray-500">({calculatePercentage(item.value)}%)</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Total cost */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4 border-t-2 border-primary">
          <span className="font-semibold text-lg">Total Cost</span>
          <span className="font-bold text-xl text-primary">{costs.total}</span>
        </div>
      </div>
    </div>
  );
};

export default CostsTab; 