// src/components/InsightCard.jsx
import React from 'react';

const InsightCard = ({ title, value, description, color, progress, chartData }) => {
  return (
    <div className={`p-6 bg-${color}-100 rounded-xl shadow-lg`}>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4">
        <span className="text-2xl font-bold">{value}</span>
      </div>

      {progress && (
        <div className="mt-2">
          <p className="text-gray-600">Progress: {progress}%</p>
          <div className="h-2 bg-gray-300 rounded-full">
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {chartData && (
        <div className="mt-4">
          {/* You can render your chart here using a chart library like Recharts */}
          {/* Example: <Chart data={chartData} /> */}
        </div>
      )}
    </div>
  );
};

export default InsightCard;
