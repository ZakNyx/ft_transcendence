import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  wins: number;
  losses: number;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ wins, losses }) => {
  const totalMatches = wins + losses;
  const winratePercentage = (wins / totalMatches) * 100;

  const chartData = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [wins, losses],
        backgroundColor: ["#216C44", "#6C2121"],
        hoverBackgroundColor: ["#216C44", "#6C2121"],
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 16,
            weight: "bold",
          },
          color: "white",
        },
      },
    },
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-white font-bold text-2xl mb-2">WINRATE</h1>
      <p className="text-white font-semibold text-lg">
        {winratePercentage.toFixed(0)}%
      </p>
      <div className="mt-4">
        <div className="w-[15vw] h-auto">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
