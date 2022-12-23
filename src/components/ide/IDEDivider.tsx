import { Divider } from '@mui/material';
import { useTheme } from '@mui/styles';

const IDEDivider = () => {
  const theme = useTheme();
  const width = 10;
  const margin = (width / 2) * -1;
  return (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        width: `${width}px`,
        backgroundColor: theme.palette.primary.main,
        marginLeft: `${margin}px`,
        opacity: 1,
        borderWidth: 0
      }}
    />
  );
};

export default IDEDivider;