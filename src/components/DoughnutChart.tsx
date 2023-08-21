import React from "react";
import { Doughnut } from "react-chartjs-2";

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
        backgroundColor: ["#6C2121", "#216C44"],
        borderWidth: 0.5, 
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
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
      <h1 className="text-white font-bold">WINRATE</h1>
      <p className="text-white font-semibold">
        {winratePercentage.toFixed(2)}%
      </p>
      <div>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DoughnutChart;
