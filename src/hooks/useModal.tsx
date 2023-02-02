import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box, Typography } from '@mui/material';

const useModal = (initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { isOpen, openModal, closeModal };
};

export default useModal;
