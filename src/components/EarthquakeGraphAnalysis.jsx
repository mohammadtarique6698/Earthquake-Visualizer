import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarthquakeChart = ({ data }) => {
  const [filterMagnitude, setFilterMagnitude] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const groupByLocation = (data) => {
    const grouped = {};
    data.forEach((item) => {
      const location = item.location.split(",")[1]?.trim() || "Unknown";
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(item.magnitude);
    });
    return grouped;
  };

  const groupedData = groupByLocation(data);

  const aggregatedData = Object.keys(groupedData).map((location) => ({
    location,
    averageMagnitude:
      groupedData[location].reduce((sum, mag) => sum + mag, 0) /
      groupedData[location].length,
  }));

  const sortedData = aggregatedData
    .filter((item) => item.averageMagnitude >= filterMagnitude)
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.averageMagnitude - b.averageMagnitude
        : b.averageMagnitude - a.averageMagnitude
    );

  const chartData = {
    labels: selectedLocation
      ? groupedData[selectedLocation]?.map((_, index) => `Data ${index + 1}`)
      : sortedData.map((item) => item.location),
    datasets: [
      {
        label: selectedLocation
          ? `Magnitude Over Time (${selectedLocation})`
          : "Average Earthquake Magnitude by Location",
        data: selectedLocation
          ? groupedData[selectedLocation]
          : sortedData.map((item) => item.averageMagnitude),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: selectedLocation
          ? `Earthquake Magnitudes in ${selectedLocation}`
          : "Average Earthquake Magnitudes by Location",
      },
    },
    scales: {
      x: {
        ticks: { autoSkip: false },
      },
      y: {
        beginAtZero: true,
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const location = sortedData[index]?.location;
        if (location) setSelectedLocation(location);
      }
    },
  };

  return (
    <div className="w-full h-auto mt-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold mb-4">
          Earthquake Magnitudes by Location
        </h2>
        <div className=" rounded-lg p-2">
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Sort by Magnitude:{" "}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>
      <div className="w-full h-auto overflow-auto">
        <div style={{ width: "2000px", height: "400px" }}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default EarthquakeChart;
