import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({
  csvFile,
  timeFrame = "daily",
  isDashboard = false,
  chartTitle = "Member Count",
  dataKey = "member_count",
  dateKey = "date_only",
  timeKey = "time", // Assuming there is a time key for hourly data in the CSV
  backgroundColorLight = "rgba(75, 192, 192, 1)",
  backgroundColorDark = "rgba(67, 229, 244, 1)",
  cycleDelay = 1000, // Delay between cycles in milliseconds
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: chartTitle,
        data: [],
        backgroundColor: backgroundColorLight,
        borderColor: backgroundColorLight,
        borderWidth: 1,
      },
    ],
  });

  const [animatedData, setAnimatedData] = useState([]); // Store animated data for bars
  const [rawData, setRawData] = useState([]); // Store raw CSV data
  const [isAnimating, setIsAnimating] = useState(false); // Control animation state
  const [hoveredIndex, setHoveredIndex] = useState(null); // Index of the hovered bar

  // Fetch and parse CSV data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(csvFile);
      const text = await response.text();

      Papa.parse(text, {
        header: true,
        complete: (results) => {
          if (results.data.length > 0) {
            setRawData(results.data);
            processCSVData(results.data);
          }
        },
        error: (error) => {
          console.error("Error parsing CSV data:", error);
        },
      });
    } catch (error) {
      console.error("Error fetching CSV file:", error);
    }
  }, [csvFile]);

  // Process CSV data based on the selected time frame
  const processCSVData = (data) => {
    const aggregatedData = {};

    // Handle hourly, daily, and weekly timeframes
    data.forEach((row) => {
      const date = new Date(row[dateKey]);
      let key;

      if (timeFrame === "daily") {
        const hour = row[timeKey].slice(0, 2); // Extract only the hour from timeKey
        key = `${hour}:00`;  // Example: "2024-10-10 09:00"
      } else if (timeFrame === "weekly") {
        const dayOfWeek = date.toLocaleString("default", { weekday: "short" });
        key = dayOfWeek;
      } else if (timeFrame === "monthly") {
        const weekNumber = Math.ceil((date.getDate() + date.getDay()) / 7);
        key = `Week ${weekNumber}`;
      }

      aggregatedData[key] = (aggregatedData[key] || 0) + parseInt(row[dataKey], 10) || 0;
    });

    const labels = Object.keys(aggregatedData).sort((a, b) => new Date(a) - new Date(b));
    const values = labels.map((label) => aggregatedData[label]);

    setChartData({
      labels,
      datasets: [
        {
          label: chartTitle,
          data: values,
          backgroundColor: isDarkMode ? backgroundColorDark : backgroundColorLight,
          borderColor: isDarkMode ? backgroundColorDark : backgroundColorLight,
          borderWidth: 1,
        },
      ],
    });

    setAnimatedData(values.map(() => 0)); // Initialize animated data to zero
  };

  // Recursive function for animating bars with delay between cycles
  const animateBars = (index = 0) => {
    if (index < chartData.datasets[0].data.length && hoveredIndex === null) {
      setAnimatedData((prevData) =>
        prevData.map((value, i) =>
          i <= index ? chartData.datasets[0].data[i] : value
        )
      );

      // Proceed to the next index after a small delay
      setTimeout(() => animateBars(index + 1), 200); // Adjust the delay for the bar animation
    } else if (index >= chartData.datasets[0].data.length) {
      // After completing one cycle, wait for the cycle delay and restart animation
      setTimeout(() => {
        setAnimatedData(chartData.datasets[0].data.map(() => 0)); // Reset animated data to zero
        animateBars(); // Start animation again
      }, cycleDelay); // Delay before restarting the cycle
    }
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);
    const handleChange = (e) => setIsDarkMode(e.matches);
    matchMedia.addEventListener("change", handleChange);

    fetchData(); // Fetch data on mount

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [fetchData]);

  useEffect(() => {
    if (rawData.length > 0) {
      processCSVData(rawData); // Reprocess data whenever time frame changes
    }
  }, [timeFrame, rawData]);

  // Start animation on mount
  useEffect(() => {
    if (chartData.datasets[0].data.length > 0 && !isAnimating) {
      setIsAnimating(true); // Set the animation state
      animateBars(); // Start the animation
    }
  }, [chartData, isAnimating]);

  // Event handlers for mouse events on the bars
  const handleMouseEnter = (event, chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      setHoveredIndex(index);
      setAnimatedData(chartData.datasets[0].data); // Show original data on hover
      setIsAnimating(false); // Stop animation on hover
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null); // Reset hovered index
    setAnimatedData(chartData.datasets[0].data.map(() => 0)); // Reset animated data
    animateBars(); // Restart animation
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ width: "100%", height: "100%" }} className="chart-container">
        <Bar
          id="myBarChart"
          data={{
            ...chartData,
            datasets: [{
              ...chartData.datasets[0],
              data: hoveredIndex === null ? animatedData : chartData.datasets[0].data, // Use animated data or original data based on hover
            }],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // Disable built-in animations to apply custom ones
            scales: {
              x: {
                title: {
                  display: true,
                  text:
                    timeFrame === "weekly"
                      ? "Day of Week"
                      : timeFrame === "monthly"
                      ? "Weeks"
                      : timeFrame === "daily"
                      ? "Hours"
                      : "Date",
                },
                grid: {
                  display: false,
                },
              },
              y: {
                title: {
                  display: true,
                  text: chartTitle,
                },
                beginAtZero: true, // Ensure bars grow from 0
                grid: {
                  color: isDarkMode ? "rgba(220, 220, 220, 0.1)" : "rgba(0, 0, 0, 0.1)",
                },
              },
            },
            elements: {
              bar: {
                borderRadius: 10, // Add rounded corners for the bars
                backgroundColor: isDarkMode ? backgroundColorDark : backgroundColorLight,
                hoverBackgroundColor: isDarkMode ? `${backgroundColorDark}0.7` : `${backgroundColorLight}0.7`,
              },
            },
            plugins: {
              tooltip: {
                enabled: true, // Enable tooltips for additional data display
              },
            },
          }}
          onElements={handleMouseEnter} // Handle mouse enter on bar
          onLeave={handleMouseLeave} // Handle mouse leave from bar
        />
      </div>
    </div>
  );
};

export default BarChart;
