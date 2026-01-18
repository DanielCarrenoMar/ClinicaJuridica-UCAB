import { Svg, Rect, Text } from '@react-pdf/renderer';
import React from 'react';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  width?: number;
  height?: number;
  barWidth?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  width = 350, 
  height = 250, 
  barWidth = 30 
}) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const chartHeight = height - 60; // Leave more space for labels
  const leftMargin = 65; // Increased left margin for Y-axis labels
  const rightMargin = 30;
  const chartWidth = width - leftMargin - rightMargin; // Dynamic width calculation
  const totalBarWidth = data.length * barWidth;
  const totalSpacing = chartWidth - totalBarWidth;
  const barSpacing = totalSpacing / (data.length + 1);

  return (
    <Svg width={width} height={height} style={{ margin: 'auto' }}>
      {/* Y-axis line */}
      <Rect
        x={leftMargin}
        y={20}
        width={1}
        height={chartHeight}
        fill="#000000"
      />
      
      {/* X-axis line */}
      <Rect
        x={leftMargin}
        y={chartHeight}
        width={chartWidth}
        height={1}
        fill="#000000"
      />
      
      {/* Bars and labels */}
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (chartHeight - 10);
        const x = leftMargin + barSpacing + (index * (barWidth + barSpacing));
        const y = chartHeight - barHeight;
        
        return (
          <React.Fragment key={index}>
            {/* Bar */}
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={item.color}
              stroke="#000000"
              strokeWidth={1}
            />
            
            {/* Value label on top of bar */}
            <Text
              x={x + barWidth / 2}
              y={y - 3}
              fill="#000000"
              style={{
                fontSize: 10,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {item.value}
            </Text>
            
            {/* X-axis label - split into two lines if needed */}
            <Text
              x={x + barWidth / 2}
              y={chartHeight + 18}
              fill="#000000"
              style={{
                fontSize: 8,
                textAlign: 'center'
              }}
            >
              {item.label.split(' ')[0]}
            </Text>
            <Text
              x={x + barWidth / 2}
              y={chartHeight + 28}
              fill="#000000"
              style={{
                fontSize: 8,
                textAlign: 'center'
              }}
            >
              {item.label.split(' ').slice(1).join(' ')}
            </Text>
          </React.Fragment>
        );
      })}
      
      {/* Y-axis labels */}
      {[0, 25, 50, 75, 100].map((percentage) => {
        const value = Math.round((percentage / 100) * maxValue);
        const y = chartHeight - ((percentage / 100) * (chartHeight - 20));
        
        return (
          <Text
            key={percentage}
            x={leftMargin - 18}
            y={y + 2}
            fill="#000000"
            style={{
              fontSize: 8,
              textAlign: 'right'
            }}
          >
            {value}
          </Text>
        );
      })}
    </Svg>
  );
};

export default BarChart;
