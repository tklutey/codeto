import React, { useState } from 'react';

export default function useSnackbar() {
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackbarOpen(false);
  };

  return {
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleClose
  };
}
