import Layout from 'layout';
import { ReactElement, useState } from 'react';
import { Box } from '@mui/material';
import IDE from 'components/ide';

const Sandbox = () => {
  const [userCode, setUserCode] = useState<string | undefined>('');
  return (
    <Box height={'100%'} width={'100%'}>
      <IDE width={'100%'} height={'100%'} language={'java'} userCode={userCode} setUserCode={setUserCode} />
    </Box>
  );
};

Sandbox.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Sandbox;
