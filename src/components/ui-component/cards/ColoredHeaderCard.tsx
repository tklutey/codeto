import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

const ColoredHeaderCard = ({ title, children }: Props) => {
  const theme = useTheme();

  return (
    <Card sx={{ border: `1px solid ${theme.palette.primary.main}` }}>
      {title && (
        <CardHeader
          sx={{
            borderBottom: `1px solid ${theme.palette.primary.main}`,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.paper
          }}
          title={<Typography variant="h3">{title}</Typography>}
        />
      )}
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};

type Props = {
  title?: string;
  children?: React.ReactNode;
};

export default ColoredHeaderCard;
