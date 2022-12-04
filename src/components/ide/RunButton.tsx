import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const Circle = styled('div')(({ theme }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '30px',
  backgroundColor: theme.palette.primary.main
}));
const RunButton = ({ run, isExecuting, isTerminalFullHeight }: Props) => {
  const handleClick = () => {
    run();
  };

  const topPosition = isTerminalFullHeight ? 'calc(50% - 30px)' : 'calc(30% - 30px)';
  return (
    <Circle style={{ position: 'absolute', left: 'calc(50% - 30px)', top: topPosition, zIndex: 10 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer', width: '100%', height: '100%' }} role="button">
        {isExecuting ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
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
  isTerminalFullHeight?: boolean;
};

export default RunButton;
