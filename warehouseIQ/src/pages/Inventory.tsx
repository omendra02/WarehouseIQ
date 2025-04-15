import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';

interface WarehouseConfig {
  rows: number | string;
  columns: number | string;
  rackCapacity: number | string;
  binHeight: number | string;
  utilizationRate: number | string;
  binArea: number | string; // Area of each bin in square feet
}

interface WarehouseMetrics {
  totalArea: number; // Total area in square feet
  usedArea: number; // Used area in square feet
  availableArea: number; // Available area in square feet
  utilizationRate: number;
  totalBins: number;
  usedBins: number;
  availableBins: number;
}

const Inventory: React.FC = () => {
  // Initialize with empty values instead of 0
  const [config, setConfig] = useState<WarehouseConfig>({
    rows: '',
    columns: '',
    rackCapacity: '',
    binHeight: '',
    utilizationRate: '65', // Default utilization rate
    binArea: '4', // Default bin area of 4 sq ft
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add console logs for debugging
  useEffect(() => {
    console.log('Current Configuration:', config);
  }, [config]);

  const calculateMetrics = (config: WarehouseConfig): WarehouseMetrics => {
    console.log('Calculating metrics with config:', config);
    
    // Convert string values to numbers, default to 0 if empty
    const rows = Number(config.rows) || 0;
    const columns = Number(config.columns) || 0;
    const rackCapacity = Number(config.rackCapacity) || 0;
    const binHeight = Number(config.binHeight) || 0;
    const binArea = Number(config.binArea) || 0;
    const utilizationRate = Number(config.utilizationRate) || 0;
    
    // Calculate total number of bins
    const totalBins = rows * columns * rackCapacity;
    
    // Calculate total area in square feet
    const totalArea = totalBins * binArea;
    
    // Calculate used and available area
    const usedArea = Math.floor(totalArea * (utilizationRate / 100));
    const availableArea = totalArea - usedArea;
    
    // Calculate number of bins used and available
    const usedBins = Math.floor(totalBins * (utilizationRate / 100));
    const availableBins = totalBins - usedBins;

    const metrics = {
      totalArea,
      usedArea,
      availableArea,
      utilizationRate: Number(utilizationRate.toFixed(2)),
      totalBins,
      usedBins,
      availableBins
    };

    console.log('Calculated Metrics:', metrics);
    return metrics;
  };

  const { data: metrics, refetch: refetchMetrics } = useQuery<WarehouseMetrics>({
    queryKey: ['warehouseMetrics'],
    queryFn: async () => {
      console.log('Fetching metrics...');
      const calculatedMetrics = calculateMetrics(config);
      console.log('Fetched metrics:', calculatedMetrics);
      return calculatedMetrics;
    }
  });

  const mutation = useMutation<any, Error, WarehouseConfig>({
    mutationFn: async (data: WarehouseConfig) => {
      console.log('Saving configuration:', data);
      
      // Convert string values to numbers and validate
      const rows = Number(data.rows);
      const columns = Number(data.columns);
      const rackCapacity = Number(data.rackCapacity);
      const binHeight = Number(data.binHeight);
      
      if (isNaN(rows) || isNaN(columns) || isNaN(rackCapacity) || isNaN(binHeight) ||
          rows <= 0 || columns <= 0 || rackCapacity <= 0 || binHeight <= 0) {
        console.error('Validation failed:', data);
        throw new Error('All values must be greater than 0');
      }
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Configuration saved successfully');
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      console.log('Mutation successful');
      setSuccess('Configuration saved successfully');
      refetchMetrics();
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with config:', config);
    setError(null);
    setSuccess(null);
    mutation.mutate(config);
  };

  // Add test button to simulate different configurations
  const handleTestConfig = (testCase: number) => {
    console.log(`Testing configuration case ${testCase}`);
    switch (testCase) {
      case 1:
        setConfig({ rows: 5, columns: 3, rackCapacity: 10, binHeight: 100, utilizationRate: '65', binArea: '4' });
        break;
      case 2:
        setConfig({ rows: 20, columns: 10, rackCapacity: 30, binHeight: 200, utilizationRate: '65', binArea: '4' });
        break;
      case 3:
        setConfig({ rows: 0, columns: 0, rackCapacity: 0, binHeight: 0, utilizationRate: '65', binArea: '4' }); // Invalid case
        break;
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ 
      bgcolor: '#000000', 
      minHeight: '100vh',
      p: 3,
      color: '#ffffff'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff', mb: 4 }}>
        Inventory Control
      </Typography>

      {/* Test Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleTestConfig(1)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Test Case 1
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleTestConfig(2)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Test Case 2
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleTestConfig(3)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Test Invalid Case
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 4
      }}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
            height: '100%'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
              Warehouse Configuration
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Number of Rows"
                type="number"
                value={config.rows}
                onChange={(e) => setConfig({ ...config, rows: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <TextField
                label="Number of Columns"
                type="number"
                value={config.columns}
                onChange={(e) => setConfig({ ...config, columns: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <TextField
                label="Rack Capacity"
                type="number"
                value={config.rackCapacity}
                onChange={(e) => setConfig({ ...config, rackCapacity: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <TextField
                label="Bin Height (cm)"
                type="number"
                value={config.binHeight}
                onChange={(e) => setConfig({ ...config, binHeight: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <TextField
                label="Utilization Rate (%)"
                type="number"
                value={config.utilizationRate}
                onChange={(e) => setConfig({ ...config, utilizationRate: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: 0,
                  max: 100,
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <TextField
                label="Bin Area (sq ft)"
                type="number"
                value={config.binArea}
                onChange={(e) => setConfig({ ...config, binArea: e.target.value })}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  min: 0,
                  style: { 
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    margin: 0,
                  }
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </form>
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#111111',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
            height: '100%'
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff', mb: 3 }}>
              Current Inventory Status
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3
            }}>
              <Card sx={{ bgcolor: '#18181B' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Area
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    {metrics?.totalArea || 0} sq ft
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                    {metrics?.totalBins || 0} total bins
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: '#18181B' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Used Area
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    {metrics?.usedArea || 0} sq ft
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                    {metrics?.usedBins || 0} bins in use
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: '#18181B' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Available Area
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    {metrics?.availableArea || 0} sq ft
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                    {metrics?.availableBins || 0} bins available
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ bgcolor: '#18181B' }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Utilization Rate
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#ffffff' }}>
                    {metrics?.utilizationRate || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
                    Based on {metrics?.usedBins || 0} of {metrics?.totalBins || 0} bins
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Snackbar
        open={!!error || !!success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory; 