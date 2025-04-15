import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

interface StockItem {
  id: string;
  itemId: string;
  quantity: number;
  location: string;
  notes: string;
}

interface DispatchOperation {
  itemId: string;
  quantity: number;
  destination: string;
  notes: string;
}

const Dispatch: React.FC = () => {
  // Initial stock data
  const initialStockItems: StockItem[] = [
    { id: '1', itemId: 'ITEM001', quantity: 100, location: 'A1', notes: 'Main stock' },
    { id: '2', itemId: 'ITEM002', quantity: 50, location: 'B2', notes: 'Reserve stock' },
    { id: '3', itemId: 'ITEM003', quantity: 200, location: 'C3', notes: 'Bulk storage' },
  ];

  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [operation, setOperation] = useState<DispatchOperation>({
    itemId: '',
    quantity: 0,
    destination: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation<any, Error, DispatchOperation>({
    mutationFn: async (data: DispatchOperation) => {
      // Validate input
      if (!data.itemId || !data.destination || data.quantity <= 0) {
        throw new Error('Please fill in all required fields with valid values');
      }

      // Find the item to dispatch
      const itemIndex = stockItems.findIndex(item => item.itemId === data.itemId);
      if (itemIndex === -1) {
        throw new Error('Item not found in stock');
      }

      // Check if enough quantity is available
      if (stockItems[itemIndex].quantity < data.quantity) {
        throw new Error('Insufficient stock available');
      }
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Update stock items
          const updatedItems = [...stockItems];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            quantity: updatedItems[itemIndex].quantity - data.quantity,
          };
          setStockItems(updatedItems);
          
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      setSuccess('Dispatch operation completed successfully');
      setOperation({ itemId: '', quantity: 0, destination: '', notes: '' });
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    mutation.mutate(operation);
  };

  const handleTestCase = (testCase: number) => {
    switch (testCase) {
      case 1: // Dispatch from existing item
        setOperation({
          itemId: 'ITEM001',
          quantity: 30,
          destination: 'Customer A',
          notes: 'Regular dispatch'
        });
        break;
      case 2: // Large dispatch
        setOperation({
          itemId: 'ITEM003',
          quantity: 100,
          destination: 'Customer B',
          notes: 'Bulk order'
        });
        break;
      case 3: // Invalid case
        setOperation({
          itemId: '',
          quantity: 0,
          destination: '',
          notes: 'Invalid test case'
        });
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
        Dispatch Operations
      </Typography>

      {/* Test Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleTestCase(1)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Regular Dispatch
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleTestCase(2)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Bulk Dispatch
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleTestCase(3)}
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
              Dispatch Operation
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Item ID"
                value={operation.itemId}
                onChange={(e) => setOperation({ ...operation, itemId: e.target.value })}
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={operation.quantity}
                onChange={(e) => setOperation({ ...operation, quantity: Number(e.target.value) })}
                fullWidth
                inputProps={{
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
              <TextField
                label="Destination"
                value={operation.destination}
                onChange={(e) => setOperation({ ...operation, destination: e.target.value })}
                fullWidth
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
                  },
                }}
              />
              <TextField
                label="Notes"
                value={operation.notes}
                onChange={(e) => setOperation({ ...operation, notes: e.target.value })}
                fullWidth
                multiline
                rows={3}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#18181B',
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
                {mutation.isPending ? 'Processing...' : 'Process Dispatch'}
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
              Current Stock
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Item ID</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Quantity</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ color: '#ffffff' }}>{item.itemId}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{item.quantity}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{item.location}</TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>{item.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

export default Dispatch; 