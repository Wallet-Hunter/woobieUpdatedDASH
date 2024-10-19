import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ title, value, color, textColor }) => {
  return (
    <Card variant="outlined" sx={{ width: '100%', marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h5" color={color} fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h4" color={textColor} fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;