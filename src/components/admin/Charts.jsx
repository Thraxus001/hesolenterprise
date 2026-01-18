import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Reusable Chart Container
export const ChartContainer = ({ title, description, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="h-80">
        {children}
      </div>
    </div>
  );
};

// Sales Line Chart
export const SalesChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { month: 'Jan', sales: 4000, orders: 2400 },
    { month: 'Feb', sales: 3000, orders: 1398 },
    { month: 'Mar', sales: 2000, orders: 9800 },
    { month: 'Apr', sales: 2780, orders: 3908 },
    { month: 'May', sales: 1890, orders: 4800 },
    { month: 'Jun', sales: 2390, orders: 3800 },
    { month: 'Jul', sales: 3490, orders: 4300 },
  ];

  return (
    <ChartContainer title="Sales Overview" description="Monthly sales and orders trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, '']}
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sales" 
            name="Sales ($)"
            stroke="#4F46E5" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            name="Orders"
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Revenue Bar Chart
export const RevenueChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { category: 'Fiction', revenue: 4000, growth: 12 },
    { category: 'Non-Fiction', revenue: 3000, growth: 8 },
    { category: 'Science', revenue: 2000, growth: -5 },
    { category: 'Children', revenue: 2780, growth: 20 },
    { category: 'Technology', revenue: 1890, growth: 15 },
    { category: 'Biography', revenue: 2390, growth: 10 },
  ];

  return (
    <ChartContainer title="Revenue by Category" description="Book category revenue performance">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="category" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            labelFormatter={(label) => `Category: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="revenue" 
            name="Revenue ($)"
            fill="#4F46E5" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Traffic Pie Chart
export const TrafficChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: 'Direct', value: 400, color: '#4F46E5' },
    { name: 'Social', value: 300, color: '#10B981' },
    { name: 'Email', value: 300, color: '#F59E0B' },
    { name: 'Search', value: 200, color: '#EF4444' },
    { name: 'Referral', value: 100, color: '#8B5CF6' },
  ];

  return (
    <ChartContainer title="Traffic Sources" description="Website traffic distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#4F46E5'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [value, 'Visitors']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Performance Area Chart
export const PerformanceChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', visitors: 4000, pageViews: 2400 },
    { day: 'Tue', visitors: 3000, pageViews: 1398 },
    { day: 'Wed', visitors: 2000, pageViews: 9800 },
    { day: 'Thu', visitors: 2780, pageViews: 3908 },
    { day: 'Fri', visitors: 1890, pageViews: 4800 },
    { day: 'Sat', visitors: 2390, pageViews: 3800 },
    { day: 'Sun', visitors: 3490, pageViews: 4300 },
  ];

  return (
    <ChartContainer title="Weekly Performance" description="Daily visitors and page views">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            formatter={(value) => [value.toLocaleString(), '']}
            labelFormatter={(label) => `Day: ${label}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="visitors" 
            name="Visitors"
            stroke="#4F46E5" 
            fill="#4F46E5" 
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="pageViews" 
            name="Page Views"
            stroke="#10B981" 
            fill="#10B981" 
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Device Distribution Chart
export const DeviceChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { device: 'Desktop', value: 65, color: '#4F46E5' },
    { device: 'Mobile', value: 25, color: '#10B981' },
    { device: 'Tablet', value: 10, color: '#F59E0B' },
  ];

  return (
    <ChartContainer title="Device Distribution" description="User device types">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ device, percent }) => `${device}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {chartData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold" style={{ color: item.color }}>
                {item.value}%
              </div>
              <div className="text-sm text-gray-600">{item.device}</div>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
};

// Conversion Funnel Chart
export const ConversionChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { stage: 'Visitors', count: 10000, conversion: 100 },
    { stage: 'Product Views', count: 5000, conversion: 50 },
    { stage: 'Add to Cart', count: 1000, conversion: 10 },
    { stage: 'Checkout', count: 500, conversion: 5 },
    { stage: 'Purchase', count: 400, conversion: 4 },
  ];

  return (
    <ChartContainer title="Conversion Funnel" description="Sales funnel performance">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number" 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <YAxis 
            type="category" 
            dataKey="stage" 
            stroke="#6b7280"
            fontSize={12}
            width={100}
          />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'count') return [value.toLocaleString(), 'Count'];
              if (name === 'conversion') return [`${value}%`, 'Conversion Rate'];
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            name="Count"
            fill="#4F46E5" 
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="conversion" 
            name="Conversion Rate (%)"
            fill="#10B981" 
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// Simple Metric Card with Mini Chart
export const MetricCard = ({ title, value, change, chartData = [], color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span>{Math.abs(change)}% from last period</span>
          </div>
        </div>
        {chartData.length > 0 && (
          <div className="w-20 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// Export all components
export default {
  SalesChart,
  RevenueChart,
  TrafficChart,
  PerformanceChart,
  DeviceChart,
  ConversionChart,
  MetricCard,
  ChartContainer
};