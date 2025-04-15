import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  Inventory,
  LocalShipping,
  Assessment,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error,
} from '@mui/icons-material';

interface MetricCard {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

interface Activity {
  id: string;
  type: 'INVENTORY' | 'DISPATCH' | 'STOCK';
  description: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const metrics: MetricCard[] = [
    {
      title: 'Total Inventory',
      value: '1,234',
      trend: '+12.5%',
      icon: <Inventory />,
      color: '#6366F1',
    },
    {
      title: 'Active Dispatches',
      value: '48',
      trend: '+5',
      icon: <LocalShipping />,
      color: '#F59E0B',
    },
    {
      title: 'Stock Turnover',
      value: '4.2x',
      trend: '+5.7%',
      icon: <Assessment />,
      color: '#10B981',
    },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      type: 'INVENTORY',
      description: 'New inventory items added',
      timestamp: '2024-04-15T10:30:00Z',
      status: 'SUCCESS',
    },
    {
      id: '2',
      type: 'DISPATCH',
      description: 'Dispatch #1234 completed',
      timestamp: '2024-04-15T09:45:00Z',
      status: 'SUCCESS',
    },
    {
      id: '3',
      type: 'STOCK',
      description: 'Low stock alert for Item #5678',
      timestamp: '2024-04-15T09:15:00Z',
      status: 'WARNING',
    },
    {
      id: '4',
      type: 'DISPATCH',
      description: 'Failed to process dispatch #1235',
      timestamp: '2024-04-15T08:30:00Z',
      status: 'ERROR',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle color="success" />;
      case 'WARNING':
        return <Warning color="warning" />;
      case 'ERROR':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  const handleQuickAction = (action: 'inventory' | 'dispatch' | 'stock') => {
    switch (action) {
      case 'inventory':
        navigate('/inventory');
        break;
      case 'dispatch':
        navigate('/dispatch');
        break;
      case 'stock':
        navigate('/stock');
        break;
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#000000', 
      minHeight: '100vh',
      p: 3,
      color: '#ffffff'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', mb: 4 }}>
        Dashboard
      </Typography>

      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}>
        {/* Metrics Cards */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
        }}>
          {metrics.map((metric) => (
            <Card key={metric.title} sx={{ 
              bgcolor: '#111111',
              height: '100%',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
            }}>
              <CardContent>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  color: metric.color,
                }}>
                  {metric.icon}
                </Box>
                <Typography variant="h5" sx={{ color: '#ffffff', mb: 1 }}>
                  {metric.value}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {metric.title}
                  </Typography>
                  <Chip
                    label={metric.trend}
                    size="small"
                    sx={{
                      bgcolor: metric.trend.startsWith('+') ? '#10B981' : '#EF4444',
                      color: '#ffffff',
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
          gap: 3,
        }}>
          {/* Quick Actions */}
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
            height: '100%',
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Inventory />}
                fullWidth
                onClick={() => handleQuickAction('inventory')}
                sx={{ 
                  bgcolor: '#6366F1',
                  '&:hover': { bgcolor: '#4F46E5' },
                }}
              >
                Add Inventory
              </Button>
              <Button
                variant="contained"
                startIcon={<LocalShipping />}
                fullWidth
                onClick={() => handleQuickAction('dispatch')}
                sx={{ 
                  bgcolor: '#F59E0B',
                  '&:hover': { bgcolor: '#D97706' },
                }}
              >
                Create Dispatch
              </Button>
              <Button
                variant="contained"
                startIcon={<Assessment />}
                fullWidth
                onClick={() => handleQuickAction('stock')}
                sx={{ 
                  bgcolor: '#10B981',
                  '&:hover': { bgcolor: '#059669' },
                }}
              >
                Stock Report
              </Button>
            </Box>
          </Paper>

          {/* Recent Activities */}
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
            height: '100%',
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
              Recent Activities
            </Typography>
            <List sx={{ 
              bgcolor: '#18181B',
              borderRadius: 1,
              overflow: 'hidden',
            }}>
              {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ 
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
                  }}>
                    <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {getStatusIcon(activity.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ color: '#ffffff' }}>
                          {activity.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {new Date(activity.timestamp).toLocaleString()}
                        </Typography>
                      }
                    />
                    <Chip
                      label={activity.type}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 