"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { useTheme } from "./ThemeContext";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

export default function ProjectedFinancialsCard() {
  const { theme } = useTheme();

  const data = {
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        data: [1500, 1300, 1700, 1200, 2000, 1400],
        borderColor: theme === "dark" ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
        backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        tension: 0.5,
        fill: true,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: "#a1a1aa", font: { size: 14 } },
      },
      y: {
        display: false,
        grid: { display: false, drawBorder: false },
      },
    },
  };

  return (
    <div className={`${theme === "dark" ? "bg-[#18181b] rounded-lg p-6 mb-8 border border-[#232323]" : "bg-white rounded-lg p-6 mb-8 border border-gray-300"}`}>
      <div className="mb-4">
        <div className="text-sm text-gray-300 mb-1">Projected Financials</div>
        <div className="text-3xl font-bold">$15,000</div>
        <div className="text-gray-400">
          Next 6 Months <span className="text-green-400">+15%</span>
        </div>
      </div>
      <div>
        <Line data={data} options={options} height={120} />
      </div>
    </div>
  );
}
