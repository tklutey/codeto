import React, { useRef, useState } from 'react';
import { Box, Skeleton } from '@mui/material';

const WIDTH = '100%';
const HEIGHT = '90%';
const VideoPlayer = ({ youtubeTutorialUrl }: Props) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Box width={'100%'} height={'100%'}>
      {isLoading && <Skeleton variant="rectangular" width={WIDTH} height={HEIGHT} />}
      <iframe
        hidden={isLoading}
        ref={ref}
        src={youtubeTutorialUrl}
        width={WIDTH}
        height={HEIGHT}
        title="YouTube video player"
        frameBorder="0"
        onLoad={() => setIsLoading(false)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </Box>
  );
};

type Props = {
  youtubeTutorialUrl: string;
};

export default VideoPlayer;
