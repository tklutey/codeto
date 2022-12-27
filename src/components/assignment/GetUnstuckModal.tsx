import Modal from '@mui/material/Modal';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import TabPanel from 'components/ui-elements/basic/UITabs/TabPanel';
import VideoPlayer from 'components/assignment/VideoPlayer';
import ChatHelp from 'components/assignment/ChatHelp';
import AssignmentWalkthrough from 'components/assignment/AssignmentWalkthrough';
import DifferenceIcon from '@mui/icons-material/Difference';
import VideocamIcon from '@mui/icons-material/Videocam';
import ChatIcon from '@mui/icons-material/Chat';

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

const GetUnstuckModal = ({ isOpen, handleClose, youtubeTutorialUrl, solutionCode, language, setUserCode, userCode }: Props) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Tabs value={value} variant="scrollable" onChange={handleChange}>
          <Tab icon={<DifferenceIcon sx={{ fontSize: '1.3rem' }} />} label="Match" />
          <Tab icon={<VideocamIcon sx={{ fontSize: '1.3rem' }} />} label="Watch" />
          <Tab icon={<ChatIcon sx={{ fontSize: '1.3rem' }} />} label="Ask" />
        </Tabs>
        <TabPanel value={value} index={0} sx={{ height: '85%' }}>
          <AssignmentWalkthrough
            handleTestCode={handleClose}
            solutionCode={solutionCode}
            language={language}
            userCode={userCode}
            setUserCode={setUserCode}
          />
        </TabPanel>
        <TabPanel value={value} index={1} sx={{ height: '95%' }}>
          {youtubeTutorialUrl && <VideoPlayer youtubeTutorialUrl={youtubeTutorialUrl} />}
        </TabPanel>
        <TabPanel value={value} index={2} sx={{ height: '95%' }}>
          <ChatHelp />
        </TabPanel>
      </Box>
    </Modal>
  );
};

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  youtubeTutorialUrl?: string | undefined;
  solutionCode: string;
  language: string;
  userCode?: string;
  setUserCode: (code: string) => void;
};

export default GetUnstuckModal;
