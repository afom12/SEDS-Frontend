import React from 'react';

// Simple bar chart component
const BarChart = ({ data, labels, colors = ['#2563eb', '#10b981', '#14b8a6', '#f59e0b', '#ef4444'], height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: '90%' }}>
              <div
                className="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: colors[index % colors.length],
                  minHeight: item.value > 0 ? '4px' : '0',
                }}
                title={`${labels[index]}: ${item.value}`}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center truncate w-full" title={labels[index]}>
              {labels[index]}
            </div>
            <div className="text-xs font-semibold text-gray-900 mt-1">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple line chart component
const LineChart = ({ data, labels, color = '#2563eb', height = 200 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          points={points}
          className="transition-all duration-500"
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1 || 1)) * 100;
          const y = 100 - ((value - minValue) / range) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill={color}
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 text-xs text-gray-600">
        {labels.map((label, index) => (
          <span key={index} className="truncate" style={{ width: `${100 / labels.length}%` }}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Pie chart component
const PieChart = ({ data, colors = ['#2563eb', '#10b981', '#14b8a6', '#f59e0b', '#ef4444'], size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;

          const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180);
          const y2 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180);
          const largeArc = angle > 180 ? 1 : 0;

          return (
            <path
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={colors[index % colors.length]}
              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              title={`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </svg>
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700">
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { BarChart, LineChart, PieChart };

