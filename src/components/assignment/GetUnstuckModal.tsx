import Modal from '@mui/material/Modal';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import TabPanel from 'components/ui-elements/basic/UITabs/TabPanel';
import VideoPlayer from 'components/assignment/VideoPlayer';
import ChatHelp from 'components/assignment/ChatHelp';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

const GetUnstuckModal = (props: Props) => {
  const { isOpen, handleClose, youtubeTutorialUrl } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>
        <Tabs value={value} variant="scrollable" onChange={handleChange}>
          <Tab icon={<PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />} label="Match" />
          <Tab icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />} label="Watch" />
          <Tab icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />} label="Read" />
          <Tab icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />} label="Ask" />
        </Tabs>
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          {youtubeTutorialUrl && <VideoPlayer youtubeTutorialUrl={youtubeTutorialUrl} />}
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
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
};

export default GetUnstuckModal;
