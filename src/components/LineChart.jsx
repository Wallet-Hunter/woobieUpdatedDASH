import React, { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';
import styled from 'styled-components';

const LineChart = ({ csvFile, timeFrame = "daily" }) => {
  const [data, setData] = useState([]);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animationActive, setAnimationActive] = useState(true); // New state for animation control

  const processCSVData = (rawData) => {
    const aggregatedData = {};
    rawData.forEach(row => {
      const date = new Date(row.date);
      let key;

      switch (timeFrame) {
        case "daily":
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
          aggregatedData[key] = (aggregatedData[key] || 0) + parseInt(row.messages, 10) || 0;
          break;
        case "weekly":
          const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          const weekDay = date.toLocaleString('en-US', { weekday: 'long' });
          aggregatedData[weekDay] = (aggregatedData[weekDay] || 0) + parseInt(row.messages, 10) || 0;
          break;
        case "monthly":
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const weekOfMonth = Math.ceil((date.getDate() + 6) / 7);
          const weekKey = `Week ${weekOfMonth}`;
          aggregatedData[weekKey] = (aggregatedData[weekKey] || 0) + parseInt(row.messages, 10) || 0;
          break;
        case "yearly":
          key = `${date.getFullYear()}`;
          aggregatedData[key] = (aggregatedData[key] || 0) + parseInt(row.messages, 10) || 0;
          break;
        default:
          break;
      }
    });

    const formattedData = Object.keys(aggregatedData).sort().map(key => ({
      time: key,
      messages: aggregatedData[key],
    }));

    setData(formattedData);
  };

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(matchMedia.matches ? "dark" : "light");

    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    matchMedia.addEventListener("change", handleThemeChange);

    const fetchCSVData = async () => {
      try {
        const response = await fetch(csvFile);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            processCSVData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setError("Error parsing CSV");
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
        setError("Error fetching CSV");
        setLoading(false);
      }
    };

    fetchCSVData();

    return () => {
      matchMedia.removeEventListener("change", handleThemeChange);
    };
  }, [csvFile]);

  useEffect(() => {
    if (data.length > 0) {
      setIsAnimating(true);
      const animate = () => {
        setAnimationIndex(prevIndex => (prevIndex + 1) % data.length);
        requestAnimationFrame(animate);
      };
      animate();
    }
  }, [data]);

  useEffect(() => {
    setLoading(true);
    const fetchCSVData = async () => {
      try {
        const response = await fetch(csvFile);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const text = await response.text();
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            processCSVData(results.data);
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setError("Error parsing CSV");
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
        setError("Error fetching CSV");
        setLoading(false);
      }
    };

    fetchCSVData();
  }, [csvFile, timeFrame]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getAxisLabel = () => {
    switch (timeFrame) {
      case "weekly":
        return "Day of Week";
      case "monthly":
        return "Week of Month";
      case "yearly":
        return "Year";
      case "daily":
      default:
        return "Hour";
    }
  };

  return (
    <ChartContainer className={theme}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          onMouseEnter={() => {
            setIsHovered(true);
            setAnimationActive(false); // Stop animation on hover
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setAnimationActive(true); // Resume animation on hover out
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
          <XAxis
            dataKey="time"
            label={{ value: getAxisLabel(), position: 'insideBottomRight', offset: -5 }}
            tick={{ fill: "var(--axis-color)", fontSize: '0.8em' }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            label={{ value: 'Messages', angle: -90, position: 'insideLeft', offset: 10 }}
            tick={{ fill: "var(--axis-color)", fontSize: '0.8em' }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: 'none',
              color: 'var(--tooltip-color)',
              fontSize: '0.8em',
            }}
            wrapperStyle={{ zIndex: 10 }}
          />
          <Line
            type="monotone"
            dataKey="messages"
            stroke="var(--line-color)"
            strokeWidth={isHovered ? 4 : 2}
            dot={{ r: isHovered ? 6 : 4, fill: "var(--line-color)" }}
            isAnimationActive={animationActive} // Use animationActive state
            animationDuration={3000}
            animationEasing="ease-in-out"
            animationBegin={0}
            className={`growing-sinking ${isAnimating ? 'animate' : ''}`}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.light {
    --line-color: #43e5f4;
    --axis-color: #333333;
    --grid-color: rgba(0, 0, 0, 0.1);
    --tooltip-bg: #f0f0f0;
    --tooltip-color: #333333;
  }

  &.dark {
    --line-color: #43e5f4;
    --axis-color: #dcdcdc;
    --grid-color: rgba(220, 220, 220, 0.1);
    --tooltip-bg: #1a1a1a;
    --tooltip-color: #ffffff;
  }

  @keyframes grow {
    0%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(1.1);
    }
  }

  .growing-sinking.animate {
    animation: grow 2s ease-in-out infinite;
  }
`;

export default LineChart;
