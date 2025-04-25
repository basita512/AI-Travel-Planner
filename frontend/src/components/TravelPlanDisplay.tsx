import { useState } from 'react';
import { 
  TravelPlan, 
  DailyItinerary, 
  Accommodation, 
  TransportOption, 
  CostBreakdown,
  Activity
} from '../types/travel';
import { 
  FaBed, 
  FaRoute, 
  FaWallet, 
  FaHiking, 
  FaPlane,
  FaMapMarkedAlt,
  FaInfoCircle,
  FaFileDownload
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TravelPlanDisplayProps {
  travelPlan: TravelPlan | null;
  loading: boolean;
}

type TabType = 'itinerary' | 'accommodations' | 'transportation' | 'costs' | 'activities';

const TravelPlanDisplay = ({ travelPlan, loading }: TravelPlanDisplayProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [showPerPersonCosts, setShowPerPersonCosts] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  // Helper function to extract just the number from price strings
  const extractPriceValue = (priceString: string): number => {
    // Remove all non-digit characters
    const numericValue = priceString.replace(/[^0-9]/g, '');
    return parseInt(numericValue, 10) || 0;
  };

  // Calculate per person costs
  const calculatePerPersonCosts = () => {
    // Use the travelers count from the travel plan
    const travelerCount = travelPlan.travelers || 1; // Default to 1 if not specified
    
    // Log the traveler count to verify it's working
    console.log('Traveler count:', travelerCount);
    
    // Extract costs with detailed debugging
    const accommodationValue = travelPlan.estimated_costs.accommodation;
    const accommodationCost = extractPriceValue(String(accommodationValue));
    
    const transportationValue = travelPlan.estimated_costs.transportation;
    const transportationCost = extractPriceValue(String(transportationValue));
    
    const activitiesValue = travelPlan.estimated_costs.activities;
    const activitiesCost = extractPriceValue(String(activitiesValue));
    
    const foodValue = travelPlan.estimated_costs.food;
    const foodCost = extractPriceValue(String(foodValue));
    
    const miscValue = travelPlan.estimated_costs.miscellaneous;
    const miscCost = miscValue ? extractPriceValue(String(miscValue)) : 0;
    
    const totalValue = travelPlan.estimated_costs.total;
    const totalCost = extractPriceValue(String(totalValue));
    
    // Format values with the ₹ symbol consistently
    return {
      accommodation: `₹${Math.round(accommodationCost / travelerCount)}`,
      transportation: `₹${Math.round(transportationCost / travelerCount)}`,
      activities: `₹${Math.round(activitiesCost / travelerCount)}`,
      food: `₹${Math.round(foodCost / travelerCount)}`,
      miscellaneous: miscCost ? `₹${Math.round(miscCost / travelerCount)}` : undefined,
      total: `₹${Math.round(totalCost / travelerCount)}`
    };
  };

  const perPersonCosts = calculatePerPersonCosts();
  
  // Sort accommodations by price (cheapest first)
  const sortedAccommodations = [...travelPlan.accommodation_suggestions].sort((a, b) => {
    return extractPriceValue(String(a.price_per_night)) - extractPriceValue(String(b.price_per_night));
  });

  // Generate PDF function
  const generatePDF = async () => {
    if (!travelPlan || isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    try {
      // Create a PDF document with margins
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // Define margins and page dimensions
      const margin = 20; // 20mm margin
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      
      // Get source and destination from transportation options
      const source = travelPlan.transportation_options[0]?.from || 'Source';
      const destination = travelPlan.transportation_options[0]?.to || 'Destination';
      
      // Track current page
      let currentPage = 1;
      
      // Helper function to add page number
      const addPageNumber = () => {
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${currentPage}`, pageWidth - 25, pageHeight - 10);
      };
      
      // Define types for the PDF sections
      type SectionData = 
        | DailyItinerary[]
        | Accommodation[]
        | TransportOption[]
        | CostBreakdown
        | Activity[];
      
      type PDFSection = {
        title: string;
        data: SectionData;
      };
      
      // Header info
      const tripDates = `${travelPlan.itinerary[0]?.date || ''} to ${travelPlan.itinerary[travelPlan.itinerary.length - 1]?.date || ''}`;
      const tripRoute = `${source} to ${destination}`;
      
      // Sections to include in PDF
      const sectionsToInclude: PDFSection[] = [
        { title: 'Itinerary', data: travelPlan.itinerary },
        { title: 'Accommodations', data: travelPlan.accommodation_suggestions },
        { title: 'Transportation', data: travelPlan.transportation_options },
        { title: 'Cost Breakdown', data: travelPlan.estimated_costs },
        { title: 'Activities', data: travelPlan.activities }
      ];
      
      // Create a common header function
      const addPageHeader = (pdf: jsPDF, pageIndex: number) => {
        // Add header to each page
        pdf.setFontSize(22);
        pdf.setTextColor(37, 99, 235); // #2563eb
        pdf.text('Your Travel Plan', pageWidth / 2, margin + 10, { align: 'center' });
        
        pdf.setFontSize(12);
        pdf.setTextColor(75, 85, 99); // #4B5563
        pdf.text(tripDates, pageWidth / 2, margin + 20, { align: 'center' });
        pdf.text(tripRoute, pageWidth / 2, margin + 28, { align: 'center' });
        
        // Add horizontal line
        pdf.setDrawColor(249, 115, 22); // #f97316
        pdf.line(margin, margin + 35, pageWidth - margin, margin + 35);
        
        // Return vertical position after header
        return margin + 45;
      };
      
      // Process each section individually
      for (let i = 0; i < sectionsToInclude.length; i++) {
        const section = sectionsToInclude[i];
        
        // If not the first section, add a new page
        if (i > 0) {
          pdf.addPage();
          currentPage++;
        }
        
        // Add header to page
        const contentStartY = addPageHeader(pdf, i);
        
        // Create a temporary div for this section
        const sectionDiv = document.createElement("div");
        sectionDiv.style.position = 'absolute';
        sectionDiv.style.left = '-9999px';
        sectionDiv.style.top = '-9999px';
        sectionDiv.style.width = contentWidth + 'mm';
        sectionDiv.style.padding = '0';
        
        // Add section header
        sectionDiv.innerHTML = `
          <h2 style="color: #1e40af; font-size: 22px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #E5E7EB;">
            ${section.title}
          </h2>
        `;
        
        // Section content based on type
        if (section.title === 'Itinerary') {
          const itemsHTML = travelPlan.itinerary.map(day => `
            <div style="margin-bottom: 20px; padding: 15px; background-color: #F9FAFB; border-left: 3px solid #2563eb; border-radius: 4px;">
              <h3 style="color: #2563eb; font-size: 16px; margin-bottom: 12px;">Day ${day.day}: ${day.date} ${day.title ? `- ${day.title}` : ''}</h3>
              <ul style="margin-left: 25px; margin-right: 15px;">
                ${day.activities.map(activity => `<li style="margin-bottom: 8px; padding-right: 10px;">${activity}</li>`).join('')}
              </ul>
            </div>
          `).join('');
          sectionDiv.innerHTML += itemsHTML;
        } 
        else if (section.title === 'Accommodations') {
          const itemsHTML = travelPlan.accommodation_suggestions.map(acc => `
            <div style="margin-bottom: 20px; padding: 15px; background-color: #F9FAFB; border-left: 3px solid #10B981; border-radius: 4px;">
              <h3 style="color: #2563eb; font-size: 16px; margin-bottom: 12px;">${acc.name}</h3>
              <p style="margin-bottom: 5px; padding-right: 10px;"><strong>Type:</strong> ${acc.type}</p>
              <p style="margin-bottom: 8px; padding-right: 10px;"><strong>Price:</strong> ${acc.price_per_night}/night</p>
              ${acc.description ? `<p style="padding-right: 10px;">${acc.description}</p>` : ''}
            </div>
          `).join('');
          sectionDiv.innerHTML += itemsHTML;
        } 
        else if (section.title === 'Transportation') {
          const itemsHTML = travelPlan.transportation_options.map(option => `
            <div style="margin-bottom: 20px; padding: 15px; background-color: #F9FAFB; border-left: 3px solid #F97316; border-radius: 4px;">
              <h3 style="color: #2563eb; font-size: 16px; margin-bottom: 12px;">${option.type}</h3>
              <p style="margin-bottom: 5px; padding-right: 10px;"><strong>Route:</strong> ${option.from} to ${option.to}</p>
              <p style="margin-bottom: 8px; padding-right: 10px;"><strong>Price:</strong> ${option.estimated_price}</p>
              ${option.details ? `<p style="padding-right: 10px;">${option.details}</p>` : ''}
            </div>
          `).join('');
          sectionDiv.innerHTML += itemsHTML;
        } 
        else if (section.title === 'Cost Breakdown') {
          const costs = travelPlan.estimated_costs;
          const costHTML = `
            <div style="margin-bottom: 25px; padding-right: 15px;">
              <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #4B5563; font-weight: 500;">Accommodation</span>
                <span style="font-weight: bold; color: #2563eb;">${costs.accommodation}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #4B5563; font-weight: 500;">Transportation</span>
                <span style="font-weight: bold; color: #2563eb;">${costs.transportation}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #4B5563; font-weight: 500;">Activities</span>
                <span style="font-weight: bold; color: #2563eb;">${costs.activities}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
                <span style="color: #4B5563; font-weight: 500;">Food</span>
                <span style="font-weight: bold; color: #2563eb;">${costs.food}</span>
              </div>
              ${costs.miscellaneous ? `
                <div style="display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
                  <span style="color: #4B5563; font-weight: 500;">Miscellaneous</span>
                  <span style="font-weight: bold; color: #2563eb;">${costs.miscellaneous}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-top: 15px; padding: 15px; background-color: #F3F4F6; border-radius: 4px;">
                <span style="font-weight: bold; color: #1F2937;">Total Cost</span>
                <span style="font-weight: bold; color: #2563eb; font-size: 18px;">${costs.total}</span>
              </div>
              
              <div style="margin-top: 25px; font-style: italic; color: #6B7280; font-size: 12px; padding: 0 5px;">
                <p style="margin-bottom: 5px;">• Food budget typically averages ₹500-1000 per person per day depending on preferences.</p>
                <p>• Miscellaneous expenses include shopping, souvenirs, additional entertainment, and unexpected costs.</p>
              </div>
            </div>
          `;
          sectionDiv.innerHTML += costHTML;
        } 
        else if (section.title === 'Activities') {
          const itemsHTML = travelPlan.activities.map(activity => `
            <div style="margin-bottom: 15px; padding: 12px 15px; border-bottom: 1px solid #E5E7EB;">
              <h3 style="color: #2563eb; font-size: 16px; margin-bottom: 8px;">${activity.name}</h3>
              <p style="color: #F97316; font-size: 12px; margin-bottom: 8px;">Category: ${activity.category}</p>
              ${activity.description ? `<p style="color: #4B5563; padding-right: 10px;">${activity.description}</p>` : ''}
            </div>
          `).join('');
          sectionDiv.innerHTML += itemsHTML;
        }
        
        // If last section, add footer
        if (i === sectionsToInclude.length - 1) {
          const footerHTML = `
            <div style="text-align: center; margin-top: 40px; padding: 15px 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 10px;">
              Generated with AI Travel Planner • ${new Date().toLocaleDateString()}
            </div>
          `;
          sectionDiv.innerHTML += footerHTML;
        }
        
        // Append to body
        document.body.appendChild(sectionDiv);
        
        // Capture to canvas
        const canvas = await html2canvas(sectionDiv, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: false
        });
        
        // Convert to image
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate dimensions - maintain aspect ratio
        const imgWidth = contentWidth;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image - starting at the position after the header
        pdf.addImage(
          imgData, 
          'PNG', 
          margin, // left margin
          contentStartY, // position after header
          imgWidth, 
          imgHeight
        );
        
        // Add page number
        addPageNumber();
        
        // Remove temporary div
        document.body.removeChild(sectionDiv);
      }
      
      // Save PDF
      pdf.save(`Travel_Plan_${source}_to_${destination}_${travelPlan.itinerary[0]?.date || new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#2563eb] flex items-center gap-2">
          <FaPlane className="text-[#f97316]" />
          Your Travel Plan
        </h2>
        {travelPlan && (
        <button 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-1 text-sm bg-[#2563eb] text-white px-3 py-1.5 rounded-md hover:bg-[#1e40af] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <FaFileDownload />
            <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
        </button>
        )}
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

      {/* Visible content based on active tab */}
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
            <p className="text-gray-600 text-sm mb-4">
              Accommodations are sorted from most affordable to premium options.
            </p>
            <div className="space-y-4">
              {sortedAccommodations.map((accommodation, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-[#2563eb]">{accommodation.name}</h4>
                    <div>
                      <span className="font-bold">{accommodation.price_per_night}</span>
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
                    <div className="font-bold">{option.estimated_price}</div>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#1e40af]">Cost Breakdown</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowPerPersonCosts(!showPerPersonCosts)}
                  className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition text-gray-700"
                >
                  <FaInfoCircle className="text-[#2563eb]" />
                  {showPerPersonCosts 
                    ? "Show Total Cost" 
                    : travelPlan.travelers && travelPlan.travelers > 1 
                      ? "Show Per Person" 
                      : "Show Individual Breakdown"
                  }
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="text-[#2563eb] mt-1 flex-shrink-0" />
                <p className="text-gray-700">
                  {showPerPersonCosts 
                    ? (travelPlan.travelers && travelPlan.travelers > 1) 
                      ? "Showing estimated cost per person. The total trip cost is split between travelers."
                      : "Showing individual costs. Since there's only one traveler, these are the same as total costs."
                    : "Showing total costs for your trip. Toggle to see individual cost breakdown."
                  }
                </p>
              </div>
            </div>

            <div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Accommodation</span>
                  <span className="font-bold">
                    {showPerPersonCosts ? perPersonCosts.accommodation : travelPlan.estimated_costs.accommodation}
                    {showPerPersonCosts && travelPlan.travelers && travelPlan.travelers > 1 && <span className="text-xs text-gray-500 ml-1">per person</span>}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Transportation</span>
                  <span className="font-bold">
                    {showPerPersonCosts ? perPersonCosts.transportation : travelPlan.estimated_costs.transportation}
                    {showPerPersonCosts && travelPlan.travelers && travelPlan.travelers > 1 && <span className="text-xs text-gray-500 ml-1">per person</span>}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <span className="text-gray-700">Activities</span>
                  <span className="font-bold">
                    {showPerPersonCosts ? perPersonCosts.activities : travelPlan.estimated_costs.activities}
                    {showPerPersonCosts && travelPlan.travelers && travelPlan.travelers > 1 && <span className="text-xs text-gray-500 ml-1">per person</span>}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b">
                  <div>
                  <span className="text-gray-700">Food</span>
                    <p className="text-xs text-gray-500">Typically ₹500-1000 per person per day</p>
                  </div>
                  <span className="font-bold">
                    {showPerPersonCosts ? perPersonCosts.food : travelPlan.estimated_costs.food}
                    {showPerPersonCosts && travelPlan.travelers && travelPlan.travelers > 1 && <span className="text-xs text-gray-500 ml-1">per person</span>}
                  </span>
                </div>
                {travelPlan.estimated_costs.miscellaneous && (
                  <div className="flex justify-between p-3 border-b">
                    <span className="text-gray-700">Miscellaneous</span>
                    <span className="font-bold">
                      {showPerPersonCosts ? perPersonCosts.miscellaneous : travelPlan.estimated_costs.miscellaneous}
                      {showPerPersonCosts && travelPlan.travelers && travelPlan.travelers > 1 && <span className="text-xs text-gray-500 ml-1">per person</span>}
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-3 mt-2 bg-gray-50 rounded-md">
                  <span className="font-semibold text-gray-800">
                    {showPerPersonCosts 
                      ? (travelPlan.travelers && travelPlan.travelers > 1) 
                        ? "Total Cost Per Person" 
                        : "Total Individual Cost"
                      : "Total Cost"
                    }
                  </span>
                  <span className="font-bold text-xl text-[#2563eb]">
                    {showPerPersonCosts ? perPersonCosts.total : travelPlan.estimated_costs.total}
                  </span>
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