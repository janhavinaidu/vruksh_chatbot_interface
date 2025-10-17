// app/components/AnalysisHub.tsx
"use client";

import React, { useState } from 'react';
import { X, Loader } from 'lucide-react'; // Using lucide-react for icons

// You'd typically use a charting library like Recharts or Chart.js for real charts.
// For now, we'll use placeholder divs with background colors to simulate bars/pie segments.

const AnalysisHub = () => {
  const [topics, setTopics] = useState<string[]>(['Leukemia', 'Lung Cancer']);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisRan, setAnalysisRan] = useState(false); // New state to control visibility

  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTopic = inputValue.trim();
      if (!topics.includes(newTopic)) {
        setTopics([...topics, newTopic]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter(topic => topic !== topicToRemove));
  };
  
  const handleRunAnalysis = async () => {
    if (topics.length < 1) return;
    setIsLoading(true);
    setAnalysisRan(false); // Hide previous results while loading
    
    // Simulate API call to fetch and process data from OpenAlex/PubMed
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate loading time
    
    // In a real scenario, this is where you'd process fetched data
    // and format it for your charting library.
    
    setIsLoading(false);
    setAnalysisRan(true); // Show results after loading
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
      {/* Header and Topic Tags */}
      <div className="flex justify-between items-start mb-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Analysis Hub</h2>
          <p className="text-sm text-gray-500">Comparative analysis across selected research topics</p>
        </div>
        <div className="flex gap-2">
          {topics.map(topic => (
            <div key={topic} className="flex items-center gap-1 bg-purple-600 text-white text-sm font-medium px-3 py-1 rounded-full">
              {topic}
              <button onClick={() => handleRemoveTopic(topic)} className="ml-1 hover:text-purple-200">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Input for Adding Topics */}
      <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 mb-4 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleAddTopic}
          placeholder="Add topic or researcher name and press Enter..."
          className="flex-grow bg-transparent outline-none p-1 text-gray-800"
        />
        {/* We can add an Add button here if desired, but Enter key is common */}
      </div>

      {/* Run Analysis Button */}
      <button
        onClick={handleRunAnalysis}
        disabled={isLoading || topics.length < 1}
        className="w-full bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mb-4 flex-shrink-0 transition-colors"
      >
        {isLoading ? <><Loader className="animate-spin mr-2" size={20} /> Running Analysis...</> : 'Run Comparative Analysis'}
      </button>

      {/* Display Charts - Conditional rendering */}
      {analysisRan && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-auto min-h-0">
          {/* Publication Trends by Year (Bar Chart Simulation) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col min-h-[250px]">
            <h3 className="font-semibold text-gray-700 mb-4">Publication Trends by Year</h3>
            <div className="flex-grow flex items-end justify-around h-40"> {/* h-40 gives a fixed height for visual */}
              {/* Mock bars - replace with actual chart component later */}
              <div className="w-6 h-1/4 bg-purple-400 rounded-t-sm"></div>
              <div className="w-6 h-2/5 bg-purple-600 rounded-t-sm"></div>
              <div className="w-6 h-3/5 bg-purple-400 rounded-t-sm"></div>
              <div className="w-6 h-4/5 bg-purple-600 rounded-t-sm"></div>
              <div className="w-6 h-full bg-purple-400 rounded-t-sm"></div>
              {/* Add a second set of bars for the second topic, e.g., using a different shade */}
              <div className="w-6 h-1/5 bg-purple-200 rounded-t-sm"></div>
              <div className="w-6 h-3/5 bg-purple-300 rounded-t-sm"></div>
              <div className="w-6 h-2/5 bg-purple-200 rounded-t-sm"></div>
              <div className="w-6 h-full bg-purple-300 rounded-t-sm"></div>
              <div className="w-6 h-4/5 bg-purple-200 rounded-t-sm"></div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">Mock Data: Years 2020-2024</p>
          </div>

          {/* Top Research Institutions (Pie Chart Simulation) */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col min-h-[250px]">
            <h3 className="font-semibold text-gray-700 mb-4">Top Research Institutions</h3>
            <div className="flex-grow flex items-center justify-center relative h-40"> {/* h-40 for fixed height */}
              {/* Mock Pie Chart - replace with actual chart component later */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-inner">
                {/* Simulate pie slices using background gradients or stacked divs */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600" style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)' }}></div> {/* Grey slice */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600" style={{ clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%, 50% 50%)' }}></div> {/* Purple slice */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }}></div> {/* Blue slice */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)' }}></div> {/* Pink slice */}
              </div>
            </div>
            {/* Legend for the pie chart */}
            <div className="mt-4 text-xs text-gray-600 space-y-1">
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>Harvard University (18%)</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Johns Hopkins (15%)</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Stanford (13%)</div>
              <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>MIT (12%)</div>
            </div>
          </div>
        </div>
      )}

      {/* If no analysis ran or topics selected */}
      {!analysisRan && !isLoading && (
        <div className="flex-grow flex items-center justify-center text-gray-400 text-center">
          Add topics (e.g., "Leukemia", "CRISPR-Cas9", "Dr. Jane Smith") and click 'Run Comparative Analysis' to see charts.
        </div>
      )}
    </div>
  );
};

export default AnalysisHub;