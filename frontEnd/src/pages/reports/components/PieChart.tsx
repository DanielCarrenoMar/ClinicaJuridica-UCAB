import { Svg, Path, Circle } from '@react-pdf/renderer';
import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top

  const createArcPath = (startAngle: number, endAngle: number, radius: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <Svg width={size} height={size} style={{ margin: 'auto' }}>
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;
        
        const path = createArcPath(currentAngle, endAngle, radius);
        currentAngle = endAngle;
        
        return (
          <Path
            key={index}
            d={path}
            fill={item.color}
            stroke="#ffffff"
            strokeWidth={2}
          />
        );
      })}
      
      {/* Optional: Add a white circle in the center for donut effect */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.3}
        fill="#ffffff"
      />
    </Svg>
  );
};

export default PieChart;
