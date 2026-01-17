import { Svg, Path, Circle, Text } from '@react-pdf/renderer';
import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  is3D?: boolean;
  showLabels?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ data, size = 200, is3D = false, showLabels = false }) => {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;
  const depth = is3D ? 15 : 0; // 3D depth
  
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

  const create3DSidePath = (startAngle: number, endAngle: number, radius: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const x1_bottom = x1;
    const y1_bottom = y1 + depth;
    const x2_bottom = x2;
    const y2_bottom = y2 + depth;
    
    return `M ${x1} ${y1} L ${x2} ${y2} L ${x2_bottom} ${y2_bottom} L ${x1_bottom} ${y1_bottom} Z`;
  };

  const getLabelPosition = (startAngle: number, endAngle: number, radius: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;
    const labelRadius = radius * 0.85; // Position label at 85% of radius for lines
    
    const x = centerX + labelRadius * Math.cos(midAngleRad);
    const y = centerY + labelRadius * Math.sin(midAngleRad);
    
    return { x, y, angle: midAngle };
  };

  const createLinePath = (startX: number, startY: number, endX: number, endY: number, angle: number) => {
    // Calculate line endpoint for label
    const lineLength = 20;
    const angleRad = (angle * Math.PI) / 180;
    const finalX = endX + lineLength * Math.cos(angleRad);
    const finalY = endY + lineLength * Math.sin(angleRad);
    
    return `M ${startX} ${startY} L ${endX} ${endY} L ${finalX} ${finalY}`;
  };

  return (
    <Svg width={size} height={size + (is3D ? depth : 0)} style={{ margin: 'auto' }}>
      {/* 3D sides - draw first so they appear behind */}
      {is3D && data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;
        
        // Only show 3D sides for bottom half of pie
        if (currentAngle > 90 && currentAngle < 270) {
          const sidePath = create3DSidePath(currentAngle, endAngle, radius);
          currentAngle = endAngle;
          
          return (
            <Path
              key={`side-${index}`}
              d={sidePath}
              fill={item.color}
              stroke="#ffffff"
              strokeWidth={1}
              opacity={0.8}
            />
          );
        }
        currentAngle = endAngle;
        return null;
      })}
      
      {/* Reset angle for main pie */}
      {is3D && (currentAngle = -90)}
      
      {/* Main pie slices */}
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = currentAngle + angle;
        
        const path = createArcPath(currentAngle, endAngle, radius);
        const labelPos = showLabels ? getLabelPosition(currentAngle, endAngle, radius) : null;
        currentAngle = endAngle;
        
        return (
          <React.Fragment key={index}>
            <Path
              d={path}
              fill={item.color}
              stroke="#000000"
              strokeWidth={1}
            />
            
            {/* Value labels with lines */}
            {showLabels && labelPos && (
              <React.Fragment>
                {/* Line from pie edge to label */}
                <Path
                  d={createLinePath(
                    centerX + radius * 0.7 * Math.cos((labelPos.angle * Math.PI) / 180),
                    centerY + radius * 0.7 * Math.sin((labelPos.angle * Math.PI) / 180),
                    labelPos.x,
                    labelPos.y,
                    labelPos.angle
                  )}
                  stroke="#666666"
                  strokeWidth={1}
                  fill="none"
                />
                {/* Label text */}
                <Text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill="#000000"
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {item.value}
                </Text>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })}
      
      {/* Optional: Add a white circle in the center for donut effect */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.3}
        fill="#ffffff"
        stroke="#000000"
        strokeWidth={1}
      />
    </Svg>
  );
};

export default PieChart;
