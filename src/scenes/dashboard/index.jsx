import React, { useState } from "react";
import { Box, Typography, Button,  useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData"; 
import Header from "../../components/Header";
import StatCard1 from "../../components/NumberCard1";
import StatCard2 from "../../components/NumberCard2"
import BarChart from "../../components/BarChart";
import SentimentMeter from "../../components/SentimentMeter";
import HeatMap from "../../components/HeatMap";
import LineGraph from "../../components/LineChart";
import ComboChart from "../../components/ComboChart";
import WorldMap from "../../components/WorldMap";
import Leaderboard from "../../components/LeaderBoard"; 
import csvFile from "../../csvData/hours_messages.csv";
import daily_file from "../../csvData/daily_member_growth.csv";
import worldcsv from "../../csvData/worldmap.csv";
import heatmapcsv from "../../csvData/messages_data-2.csv";
import combocsv from "../../csvData/ComboChart.csv";
import "../../css/AnimatedBox.css";

const Dashboard = ({ isSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [timePeriod, setTimePeriod] = useState("daily");

  return (
    <div className={`dashboard ${isSidebar ? '' : 'collapsed'}`}>
      <Box
        sx={{
          marginLeft: isSidebar ? "80px" : "250px",
          padding: "10px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header
            title={
              <Typography
                variant="h4"
                fontSize="2rem"
                fontWeight="bolder"
                color={colors.grey[100]}
              >
                WooBee
              </Typography>
            }
            subtitle={
              <Typography variant="h6" color={colors.grey[400]}>
                Building Dreams, Together
              </Typography>
            }
          />

          {/* Time Period Buttons */}
          <Box>
            {["daily", "weekly", "monthly"].map((period) => (
              <Button
                key={period}
                variant={timePeriod === period ? "contained" : "outlined"}
                onClick={() => setTimePeriod(period)}
                sx={{
                  marginRight: "10px",
                  backgroundColor:
                    timePeriod === period ? colors.green[500] : "transparent",
                  color: timePeriod === period ? "white" : colors.green[500],
                  fontWeight: "bolder",
                  "&:hover": {
                    backgroundColor:
                      timePeriod === period
                        ? colors.green[700]
                        : "rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                {period === "daily" ? "1D" : period === "weekly" ? "1W" : "1M"}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Main Box for all Charts */}
        <Box
          sx={{
            backgroundColor: colors.grey[800],
            borderRadius: "16px",
            padding: "10px",
            marginTop: "20px",
            border: `4px solid ${colors.grey[500]}`,
          }}
        >
          {/* Main Grid for Charts and Statistics */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="10px"
          >
            {/* Combined Number Cards */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              borderRadius="16px"
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              flexDirection="column"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <StatCard1
                title="Total Messages"
                value="1200"
                color={colors.green[500]}
                textColor={colors.grey[100]}
              />
              <StatCard2
                title="Total Active Members"
                value="450"
                color={colors.green[500]}
                textColor={colors.grey[100]}
              />
            </Box>

            {/* Sentiment Meter */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Sentiment Analysis
              </Typography>
              <Box
                width="90%"
                height="100%"
                maxWidth="900px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                m="0"
                
              >
                <SentimentMeter csvFile={csvFile} timeFrame={timePeriod} />
              </Box>
            </Box>

            {/* Leaderboard */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 3"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              justifyContent="center"
              alignItems="center"
              m="0"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Leaderboard timeFrame={timePeriod}/>
            </Box>

            {/* Bar Chart */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              borderRadius="16px"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Member Count
              </Typography>
              <Box height="90%" m="0">
                <BarChart csvFile={daily_file} timeFrame={timePeriod} isDashboard />
              </Box>
            </Box>

            {/* Line Chart */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              overflow="hidden"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Message Count
              </Typography>
              <LineGraph csvFile={csvFile} timeFrame={timePeriod} isDashboard />
            </Box>

            {/* Recent Analytics */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 3"
              overflow="auto"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p="15px"
              >
                <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                  Recent Analytics
                </Typography>
              </Box>
              {mockTransactions.map((transaction, i) => (
                <Box
                  key={`${transaction.txId}-${i}`}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p="15px"
                >
                  <Typography
                    color={colors.greenAccent[100]}
                    variant="h5"
                    fontWeight="600"
                  >
                    Group with Maximum Participants: CryptoMoonShots Chat (36694)
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Combo Chart */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              
              overflow="hidden"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Reaction Distribution
              </Typography>
              <ComboChart
                csvFile={combocsv}
                timeFrame={timePeriod}
                isDashboard
              />
            </Box>

            {/* Heat Map */}
            <Box
              className="animated-border-box"
              gridColumn="span 4"
              gridRow="span 2"
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              overflow="hidden"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Activity Heatmap
              </Typography>
              <HeatMap csvFile={heatmapcsv} timePeriod={timePeriod} />
            </Box>

            {/* World Map */}
            <Box
              className="animated-border-box"
              gridColumn="span 12"
              gridRow="span 4"
              borderRadius="16px"
              overflow="hidden"
              sx={{ 
                backgroundColor: colors.primary[900],
                boxShadow: `0px 4px 12px rgba(0, 0, 0, 0.2)` // Added box shadow
              }}
            >
              <Typography variant="h6" fontWeight="600" color={colors.grey[100]} p="10px">
                Worldwide Activity
              </Typography>
              <WorldMap csvFile={worldcsv} backgroundColor= "transparent" />
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
