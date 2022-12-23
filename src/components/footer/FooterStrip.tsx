import { styled } from '@mui/material/styles';

export const StyledFooter = styled('footer')(({ theme }) => ({
  width: 'calc(100% + 40px)',
  height: '65px',
  background: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  marginLeft: '-20px',
  marginRight: '-20px',
  alignItems: 'center',
  position: 'absolute',
  bottom: -20
}));
const FooterStrip = ({ children }: Props) => {
  return <StyledFooter>{children}</StyledFooter>;
};

type Props = {
  children: React.ReactNode;
};

export default FooterStrip;
