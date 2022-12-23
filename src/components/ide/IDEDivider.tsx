import { Divider } from '@mui/material';
import { useTheme } from '@mui/styles';

const IDEDivider = () => {
  const theme = useTheme();
  const width = 5;
  const margin = (width / 2) * -1;
  return (
    <Divider
      orientation="vertical"
      sx={{
        width: `${width}px`,
        backgroundColor: theme.palette.primary.main,
        marginLeft: `${margin}px`,
        opacity: 1,
        borderWidth: 0,
        zIndex: 1
      }}
    />
  );
};

export default IDEDivider;
