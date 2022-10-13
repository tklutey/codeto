import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const Circle = styled('div')(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  backgroundColor: theme.palette.primary.main
}));
const RunButton = (props: Props) => {
  const { run, isExecuting } = props;
  const handleClick = () => {
    run();
  };

  return (
    <Circle style={{ position: 'absolute', left: 'calc(50% - 30px)', top: '30%', zIndex: 10 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer', width: '100%', height: '100%' }} role="button">
        {isExecuting ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <PlayCircleIcon sx={{ fontSize: 60 }} />
        )}
      </div>
    </Circle>
  );
};

type Props = {
  isExecuting: boolean;
  run: () => void;
};

export default RunButton;
