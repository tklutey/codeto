import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { CircularProgress } from '@mui/material';

const RunButton = (props: Props) => {
  const { run, isExecuting } = props;
  const handleClick = () => {
    run();
  };

  return (
    <div style={{ position: 'absolute', left: 'calc(50% - 30px)', top: '30%', zIndex: 10 }}>
      <div onClick={handleClick} style={{ cursor: 'pointer' }} role="button">
        {isExecuting ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <PlayCircleIcon sx={{ fontSize: 60 }} />
        )}
      </div>
    </div>
  );
};

type Props = {
  isExecuting: boolean;
  run: () => void;
};

export default RunButton;
