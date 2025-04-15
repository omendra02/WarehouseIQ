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

interface StockOperation {
  itemId: string;
  quantity: number;
  location: string;
  notes: string;
}

const Stock: React.FC = () => {
  // Initial stock data
  const initialStockItems: StockItem[] = [
    { id: '1', itemId: 'ITEM001', quantity: 100, location: 'A1', notes: 'Main stock' },
    { id: '2', itemId: 'ITEM002', quantity: 50, location: 'B2', notes: 'Reserve stock' },
    { id: '3', itemId: 'ITEM003', quantity: 200, location: 'C3', notes: 'Bulk storage' },
  ];

  const [stockItems, setStockItems] = useState<StockItem[]>(initialStockItems);
  const [operation, setOperation] = useState<StockOperation>({
    itemId: '',
    quantity: 0,
    location: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add console logs for debugging
  console.log('Current Operation:', operation);

  const mutation = useMutation<any, Error, StockOperation>({
    mutationFn: async (data: StockOperation) => {
      // Validate input
      if (!data.itemId || !data.location || data.quantity <= 0) {
        throw new Error('Please fill in all required fields with valid values');
      }
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Update stock items
          const existingItemIndex = stockItems.findIndex(item => item.itemId === data.itemId);
          
          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...stockItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + data.quantity,
              location: data.location,
              notes: data.notes
            };
            setStockItems(updatedItems);
          } else {
            // Add new item
            const newItem: StockItem = {
              id: (stockItems.length + 1).toString(),
              itemId: data.itemId,
              quantity: data.quantity,
              location: data.location,
              notes: data.notes
            };
            setStockItems([...stockItems, newItem]);
          }
          
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      console.log('Mutation successful');
      setSuccess('Stock operation completed successfully');
      setOperation({ itemId: '', quantity: 0, location: '', notes: '' });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      setError(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with operation:', operation);
    setError(null);
    setSuccess(null);
    mutation.mutate(operation);
  };

  // Add test cases
  const handleTestCase = (testCase: number) => {
    console.log(`Testing case ${testCase}`);
    switch (testCase) {
      case 1: // Add to existing item
        setOperation({
          itemId: 'ITEM001',
          quantity: 50,
          location: 'A1',
          notes: 'Adding stock to existing item'
        });
        break;
      case 2: // Add new item
        setOperation({
          itemId: 'ITEM004',
          quantity: 75,
          location: 'D4',
          notes: 'New stock item'
        });
        break;
      case 3: // Invalid case
        setOperation({
          itemId: '',
          quantity: 0,
          location: '',
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
        Stock Management
      </Typography>

      {/* Test Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleTestCase(1)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Add to Existing Item
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleTestCase(2)}
          sx={{ color: '#ffffff', borderColor: '#ffffff' }}
        >
          Add New Item
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
              Stock Operation
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
                label="Location"
                value={operation.location}
                onChange={(e) => setOperation({ ...operation, location: e.target.value })}
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
                {mutation.isPending ? 'Processing...' : 'Process Stock'}
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

export default Stock; 