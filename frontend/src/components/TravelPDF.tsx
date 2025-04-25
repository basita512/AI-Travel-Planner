import { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font,  pdf } from '@react-pdf/renderer';
import { TravelPlan } from '../types/travel';
import { FaFileDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';

// Register fonts for PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 'light' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 'medium' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' }
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#f97316',
    paddingBottom: 15,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#1e40af',
    fontWeight: 'bold',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 8,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    marginBottom: 8,
  },
  column: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    color: '#4B5563',
    width: '50%',
    fontWeight: 'medium',
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'right',
    color: '#2563eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    padding: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  activityItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  footer: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  itineraryDay: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  accommodationItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  transportItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#F97316',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 10,
    color: '#6B7280',
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 40,
  },
  travelDetails: {
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 4,
    marginTop: 40,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: '40%',
    fontWeight: 'medium',
    color: '#4B5563',
  },
  detailValue: {
    width: '60%',
    color: '#1F2937',
  },
  activityCategory: {
    color: '#F97316',
    fontSize: 10,
    marginBottom: 5,
  },
});

// Create PDF Document
const TravelPlanPDF = ({ travelPlan }: { travelPlan: TravelPlan }) => {
  // Helper function to format currency with rupee symbol
  const formatCurrency = (value: string | number) => {
    const stringValue = String(value);
    // Ensure the value has the rupee symbol
    if (!stringValue.includes('₹')) {
      return `₹${stringValue}`;
    }
    return stringValue;
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.header, { fontSize: 28, borderBottomWidth: 0, marginBottom: 10 }]}>Your Travel Plan</Text>
          <Text style={styles.coverSubtitle}>
            {travelPlan.itinerary[0]?.date} to {travelPlan.itinerary[travelPlan.itinerary.length - 1]?.date}
          </Text>
          
          <View style={styles.travelDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>From:</Text>
              <Text style={styles.detailValue}>{travelPlan.transportation_options[0]?.from || 'Source'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>To:</Text>
              <Text style={styles.detailValue}>{travelPlan.transportation_options[0]?.to || 'Destination'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Cost:</Text>
              <Text style={styles.detailValue}>{formatCurrency(travelPlan.estimated_costs.total)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.pageNumber}>1</Text>
      </Page>
      
      {/* Itinerary Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Day by Day Itinerary</Text>
        <View style={styles.section}>
          {travelPlan.itinerary.map((day, index) => (
            <View key={index} style={styles.itineraryDay}>
              <Text style={styles.subTitle}>Day {day.day}: {day.date} {day.title && `- ${day.title}`}</Text>
              {day.activities.map((activity, i) => (
                <Text key={i} style={styles.text}>• {activity}</Text>
              ))}
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber}>2</Text>
      </Page>
      
      {/* Accommodation Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Recommended Accommodations</Text>
        <View style={styles.section}>
          {travelPlan.accommodation_suggestions.map((accommodation, index) => (
            <View key={index} style={styles.accommodationItem}>
              <Text style={styles.subTitle}>{accommodation.name}</Text>
              <Text style={styles.text}>Type: {accommodation.type}</Text>
              <Text style={styles.text}>Price: {formatCurrency(accommodation.price_per_night)}/night</Text>
              {accommodation.description && (
                <Text style={styles.text}>{accommodation.description}</Text>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber}>3</Text>
      </Page>
      
      {/* Transportation Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Transportation Options</Text>
        <View style={styles.section}>
          {travelPlan.transportation_options.map((option, index) => (
            <View key={index} style={styles.transportItem}>
              <Text style={styles.subTitle}>{option.type}</Text>
              <Text style={styles.text}>Route: {option.from} to {option.to}</Text>
              <Text style={styles.text}>Price: {formatCurrency(option.estimated_price)}</Text>
              {option.details && (
                <Text style={styles.text}>{option.details}</Text>
              )}
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber}>4</Text>
      </Page>
      
      {/* Cost Breakdown Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Cost Breakdown</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Accommodation</Text>
            <Text style={styles.value}>{formatCurrency(travelPlan.estimated_costs.accommodation)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transportation</Text>
            <Text style={styles.value}>{formatCurrency(travelPlan.estimated_costs.transportation)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Activities</Text>
            <Text style={styles.value}>{formatCurrency(travelPlan.estimated_costs.activities)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Food</Text>
            <Text style={styles.value}>{formatCurrency(travelPlan.estimated_costs.food)}</Text>
          </View>
          {travelPlan.estimated_costs.miscellaneous && (
            <View style={styles.row}>
              <Text style={styles.label}>Miscellaneous</Text>
              <Text style={styles.value}>{formatCurrency(travelPlan.estimated_costs.miscellaneous)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>{formatCurrency(travelPlan.estimated_costs.total)}</Text>
          </View>
          
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#6B7280', marginBottom: 5 }}>
              Notes:
            </Text>
            <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }}>
              • Food budget typically averages ₹500-1000 per person per day depending on preferences.
            </Text>
            <Text style={{ fontSize: 10, color: '#6B7280' }}>
              • Miscellaneous expenses include shopping, souvenirs, additional entertainment, and unexpected costs.
            </Text>
          </View>
        </View>
        <Text style={styles.pageNumber}>5</Text>
      </Page>
      
      {/* Activities Page */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Recommended Activities</Text>
        <View style={styles.section}>
          {travelPlan.activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.subTitle}>{activity.name}</Text>
              <Text style={styles.activityCategory}>Category: {activity.category}</Text>
              {activity.description && (
                <Text style={styles.text}>{activity.description}</Text>
              )}
            </View>
          ))}
        </View>
        
        <Text style={styles.footer}>
          Generated with AI Travel Planner • {new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.pageNumber}>6</Text>
      </Page>
    </Document>
  );
};

// PDF Download component
export const TravelPlanPDFDownload = ({ travelPlan }: { travelPlan: TravelPlan }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle direct download
  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Generate PDF document
      const doc = <TravelPlanPDF travelPlan={travelPlan} />;
      const asPdf = pdf();
      asPdf.updateContainer(doc);
      const blob = await asPdf.toBlob();
      
      // Use FileSaver to save the file
      saveAs(blob, `Travel_Plan_${travelPlan.itinerary[0]?.date || new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-1 text-sm bg-[#2563eb] text-white px-3 py-1.5 rounded-md hover:bg-[#1e40af] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      style={{ cursor: isGenerating ? 'not-allowed' : 'pointer' }}
    >
      <FaFileDownload />
      <span>
        {isGenerating ? 'Generating PDF...' : 'Download PDF'}
      </span>
    </button>
  );
};

export default TravelPlanPDF; 