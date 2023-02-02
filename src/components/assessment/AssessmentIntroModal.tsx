import Modal from '@mui/material/Modal';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import TabPanel from 'components/ui-elements/basic/UITabs/TabPanel';
import VideoPlayer from 'components/assignment/VideoPlayer';
import ChatHelp from 'components/assignment/ChatHelp';
import AssignmentWalkthrough from 'components/assignment/AssignmentWalkthrough';
import DifferenceIcon from '@mui/icons-material/Difference';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';
import { ScaffoldingConfiguration } from '../../layout/ProgrammingActivityLayout/scaffolding';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  height: '85%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const AssessmentIntroModal = ({ isOpen, handleClose }: Props) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant={'h2'}>Here is some text</Typography>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export default AssessmentIntroModal;
