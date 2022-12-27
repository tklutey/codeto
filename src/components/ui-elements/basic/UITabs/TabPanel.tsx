import { TabsProps } from 'types';
import { Box } from '@mui/material';
import React from 'react';

export default function TabPanel({ children, value, index, sx, ...other }: TabsProps & { sx?: any }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      {...sx}
    >
      {value === index && (
        <Box
          sx={{
            p: 3
          }}
          height={'100%'}
        >
          {children}
        </Box>
      )}
    </Box>
  );
}
