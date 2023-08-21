import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  wins: number;
  losses: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ wins, losses }) => {
  const chartData = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [wins, losses],
        backgroundColor: ["#4CAF50", "#E91E63"],
        hoverBackgroundColor: ["#4CAF50", "#E91E63"],
        borderWidth: 0, // Set the border width to 0
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom", // Place the legend at the bottom

        labels: {
          font: {
            size: 16,
            weight: "bold",
          },
          color: "white",
        },
        datalabels: {
          display: true,
          align: 'bottom',
          backgroundColor: '#ccc',
          borderRadius: 3,
          font: {
            size: 18,
          },
        }
      },
    },
  };

  return (
    <div>
      <h1 className="text-white">Allah-Las</h1>
      <div>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DoughnutChart;
