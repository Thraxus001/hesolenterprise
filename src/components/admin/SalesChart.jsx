import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Paper, Typography, Box } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesChart = ({ salesData }) => {
  // If no data or empty, show placeholders or nothing.
  // We expect salesData to be array of { month: 'Jan', sales: 0, orders: 0 }

  const hasData = salesData && salesData.length > 0;

  const labels = hasData ? salesData.map(d => d.month) : [];
  const sales = hasData ? salesData.map(d => d.sales) : [];
  const orders = hasData ? salesData.map(d => d.orders) : [];

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales (Ksh)',
        data: sales,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Orders',
        data: orders,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Sales Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monthly sales and orders data
        </Typography>
      </Box>
      <Box sx={{ height: 300 }}>
        <Line data={data} options={options} />
      </Box>
    </Paper>
  );
};

export default SalesChart;