import { useState, FormEvent } from 'react';
import { generateTravelPlan } from '../services/api';
import { TravelPlan, TravelRequest } from '../types/travel';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaMagic, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUsers, FaHiking } from 'react-icons/fa';

interface TravelFormProps {
  setTravelPlan: (plan: TravelPlan) => void;
  setLoading: (loading: boolean) => void;
}

const TravelForm = ({ setTravelPlan, setLoading }: TravelFormProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    budget: '',
    travelers: '1',
    interests: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    const request: TravelRequest = {
      source: formData.source,
      destination: formData.destination,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      budget: parseFloat(formData.budget),
      travelers: parseInt(formData.travelers),
      interests: formData.interests.split(',').map(interest => interest.trim()),
    };
    
    try {
      setLoading(true);
      const plan = await generateTravelPlan(request);
      setTravelPlan(plan);
    } catch (error) {
      console.error('Failed to generate travel plan:', error);
      alert('Failed to generate travel plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-[#2563eb] mb-6 flex items-center gap-2">
        <FaMagic className="text-[#f97316]" />
        Plan Your Perfect Trip
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="source" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
            <FaMapMarkerAlt className="text-[#2563eb] text-xs" />
            Source
          </label>
          <div className="relative">
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Where are you starting from?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="destination" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
            <FaMapMarkerAlt className="text-[#f97316] text-xs" />
            Destination
          </label>
          <div className="relative">
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Where do you want to go?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-date" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
              <FaCalendarAlt className="text-[#2563eb] text-xs" />
              Start Date
            </label>
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              placeholderText="Select date"
              required
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
              <FaCalendarAlt className="text-[#f97316] text-xs" />
              End Date
            </label>
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || undefined}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              placeholderText="Select date"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
              <FaDollarSign className="text-green-600 text-xs" />
              Budget (₹)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Your total budget"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              required
            />
          </div>
          
          <div>
            <label htmlFor="travelers" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
              <FaUsers className="text-[#2563eb] text-xs" />
              Travelers
            </label>
            <input
              type="number"
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
              min="1"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="interests" className=" text-sm font-medium mb-1 text-gray-700 flex items-center gap-1">
            <FaHiking className="text-[#f97316] text-xs" />
            Interests (comma separated)
          </label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="e.g. hiking, museums, food, beaches"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-colors bg-white text-gray-800"
            required
          />
        </div>
        
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#c2410c] text-white font-medium py-2.5 px-4 rounded-md transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 mt-6">
          <FaMagic className="text-white" /> Generate Travel Plan
        </button>
      </form>
    </div>
  );
};

export default TravelForm; 