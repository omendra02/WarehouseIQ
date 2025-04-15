import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Storage as StorageIcon,
  LocalShipping as LocalShippingIcon,
  TrendingUp,
  Schedule,
  Speed,
} from '@mui/icons-material';
import { useWarehouseMetrics } from '../hooks/useWarehouse';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

interface MenuItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  metric?: string;
  trend?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, isLoading }) => (
  <Card sx={{ 
    bgcolor: 'background.paper',
    boxShadow: 2,
    '&:hover': {
      boxShadow: 6,
      transform: 'translateY(-2px)',
      transition: 'all 0.2s'
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      {isLoading ? (
        <Skeleton variant="text" width="60%" height={40} />
      ) : (
        <Typography variant="h5" component="div" sx={{ mb: 1, color: 'text.primary', fontWeight: 600 }}>
          {value}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
        {trend && !isLoading && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: trend.startsWith('+') ? 'success.main' : 'error.main',
              fontWeight: 500,
            }}
          >
            {trend}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const MenuItem: React.FC<MenuItemProps> = ({ title, description, icon, metric, trend, isLoading }) => (
  <Card sx={{ 
    bgcolor: 'background.paper',
    boxShadow: 2,
    '&:hover': {
      boxShadow: 6,
      transform: 'translateY(-2px)',
      transition: 'all 0.2s'
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
        {icon}
      </Box>
      <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {description}
      </Typography>
      {metric && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isLoading ? (
            <Skeleton variant="text" width="40%" />
          ) : (
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {metric}
            </Typography>
          )}
          {trend && !isLoading && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: trend.startsWith('+') ? 'success.main' : 'error.main',
                fontWeight: 500,
              }}
            >
              {trend}
            </Typography>
          )}
        </Box>
      )}
    </CardContent>
  </Card>
);

function Home() {
  const { data: metrics, isLoading } = useWarehouseMetrics();

  const statsCards = [
    {
      title: 'Space Utilization',
      value: metrics ? `${metrics.spaceUtilization?.toFixed(1) ?? 0}%` : '-',
      trend: metrics?.spaceUtilization && metrics.spaceUtilization > 80 ? '-2.1%' : '+3.4%',
      icon: <TrendingUp />
    },
    {
      title: 'Efficiency Rate',
      value: metrics ? `${metrics.efficiencyRate?.toFixed(1) ?? 0}%` : '-',
      trend: '+2.1%',
      icon: <Speed />
    },
    {
      title: 'Avg. Processing Time',
      value: metrics ? `${metrics.avgProcessingTime?.toFixed(1) ?? 0} Days` : '-',
      trend: '-15%',
      icon: <Schedule />
    }
  ];

  const menuItems = [
    {
      title: 'Inventory Control',
      description: 'Optimize warehouse layout and manage inventory levels efficiently',
      icon: <InventoryIcon />,
      metric: metrics ? `${metrics.activeBins}/${metrics.totalBins} Bins` : '-',
      trend: '+5.2%'
    },
    {
      title: 'Stock Management',
      description: 'Track stock movements and maintain optimal inventory levels',
      icon: <StorageIcon />,
      metric: metrics ? `${((metrics.occupiedSpace / metrics.totalCapacity) * 100).toFixed(1)}% Capacity` : '-',
      trend: '-2.1%'
    },
    {
      title: 'Dispatch Operations',
      description: 'Streamline order processing and shipping operations',
      icon: <LocalShippingIcon />,
      metric: metrics ? `${metrics.pendingDispatches} Pending` : '-',
      trend: '+12.3%'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
          Welcome to WarehouseIQ
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Your intelligent warehouse management solution
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          }, 
          gap: 3 
        }}>
          {statsCards.map((card, index) => (
            <StatCard key={index} {...card} isLoading={isLoading} />
          ))}
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        }, 
        gap: 3 
      }}>
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} isLoading={isLoading} />
        ))}
      </Box>
    </Box>
  );
}

export default Home; 