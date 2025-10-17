// src/components/InsightsPanel.tsx

import { FileText, BarChart2, University } from 'lucide-react';
import React from 'react';

// Reusable card component for each insight
const InsightCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const InsightsPanel = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Insights for: Leukemia
        </h2>
        <p className="text-sm text-gray-500">
          Real-time analysis based on your conversation
        </p>
      </div>

      {/* Quantitative Insights */}
      <div>
        <h3 className="mb-3 text-md font-semibold text-gray-700">
          Quantitative Insights
        </h3>
        <div className="space-y-3">
          <InsightCard
            icon={<FileText size={24} />}
            value="15,280"
            label="Total Publications"
          />
          <InsightCard
            icon={<BarChart2 size={24} />}
            value="5.76%"
            label="Scientific Share of Voice"
          />
          <InsightCard
            icon={<University size={24} />}
            value="Harvard University"
            label="Top Institution"
          />
        </div>
      </div>

       {/* Qualitative Insights */}
       <div>
        <h3 className="mb-3 text-md font-semibold text-gray-700">
          Qualitative Insights
        </h3>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
          <ul className="list-inside list-disc space-y-1">
            <li>Key themes include CAR-T efficacy and long-term remission.</li>
            <li>Emerging research focuses on novel combination therapies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;