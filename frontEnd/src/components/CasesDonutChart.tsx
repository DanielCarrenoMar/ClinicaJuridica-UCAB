import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { StatusCaseAmountModel } from '#domain/models/statusCaseAmount.ts';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CasesDonutChartProps {
  statusAmounts: StatusCaseAmountModel;
}

export default function CasesDonutChart( {statusAmounts}:CasesDonutChartProps ) {

  const data = {
    labels: ['Abiertos', 'En Tramite', 'Cerrados', 'En Pausa'],
    datasets: [
      {
        data: [statusAmounts.openAmount, statusAmounts.inProgressAmount, statusAmounts.closedAmount, statusAmounts.pausedAmount],
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

  return (
    <div className="flex flex-col w-full gap-8">
        <div className='flex justify-center'>
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
                <span className="flex gap-2 align-top text-onSurface/70">
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
