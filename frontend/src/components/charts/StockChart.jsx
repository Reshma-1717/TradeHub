import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const StockChart = ({ labels = [], data = [], positive = true, height = 220 }) => {
  const lineColor = positive ? "#2ECC8A" : "#FF5E7E";

  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: lineColor,
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, positive ? "rgba(46,204,138,0.25)" : "rgba(255,94,126,0.25)");
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          return gradient;
        },
        borderWidth: 1.8,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#C9A96E",
        pointHoverBorderColor: "#07090F",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#12162A",
        borderColor: "#252B45",
        borderWidth: 1,
        titleColor: "#E8E4D9",
        bodyColor: "#C9A96E",
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4A5278", font: { size: 10 }, maxTicksLimit: 6 },
        border: { color: "#1A1F35" },
      },
      y: {
        grid: { color: "#1A1F35", lineWidth: 0.5 },
        ticks: { color: "#4A5278", font: { size: 10 }, callback: (v) => `$${v}` },
        border: { display: false },
      },
    },
    interaction: { intersect: false, mode: "index" },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StockChart;
