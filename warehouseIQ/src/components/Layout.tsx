import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
} from '@mui/material';
import {
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Storage as StorageIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { text: 'Inventory Control', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Stock Management', icon: <StorageIcon />, path: '/stock' },
  { text: 'Dispatch Operations', icon: <LocalShippingIcon />, path: '/dispatch' },
];

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000000' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#111111',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            noWrap 
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: '0.5px',
              color: '#ffffff',
            }}
          >
            WarehouseIQ
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#111111',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  mx: 2,
                  borderRadius: '12px',
                  bgcolor: location.pathname === item.path 
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'transparent',
                  color: location.pathname === item.path 
                    ? '#ffffff' 
                    : 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    bgcolor: location.pathname === item.path 
                      ? 'rgba(99, 102, 241, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{
                  color: location.pathname === item.path ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  minWidth: '40px',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#000000',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 