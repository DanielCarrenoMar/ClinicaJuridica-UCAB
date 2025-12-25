import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Abiertos', 'En Tramite', 'Cerrados', 'En Pausa'],
  datasets: [
    {
      data: [26, 30, 40, 4],
      backgroundColor: [
        '#4990E2',
        '#F39C0F',
        '#E84C3C',
        '#202020',
      ],
      borderColor: [
        '#4990E2',
        '#F39C0F',
        '#E84C3C',
        '#202020',
      ],
      borderWidth: 1,
    },
  ],
};

export default function CasesDonutChart() {
  return (
    <div className="flex flex-col gap-8 w-full h-full p-4">
        <div className='flex-1 mx-6'>
            <Doughnut 
              data={data} 
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} 
            />
        </div>
        <div className="flex flex-col gap-2">
            {data.labels.map((label, index) => (
            <div 
                key={label} 
                className={`flex gap-2 transition-opacity items-center`}
            >
                <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                />
                <span className="flex gap-2 align-baseline text-onSurface/70">
                    <h4 className='text-body-medium'>
                        {label}
                    </h4>
                    <p className='text-body-small'>
                        {data.datasets[0].data[index]}
                    </p>
                </span>
            </div>
            ))}
        </div>
    </div>
  );
}
