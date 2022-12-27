import React from 'react';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { Button, Skeleton } from '@mui/material';

const ColumnFlexDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start',
  width: '100%'
});

type ContainerProps = {
  width: string;
  height: string;
};

const Container = styled('div')<ContainerProps>((props) => ({
  width: props.width,
  height: props.height,
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start',
  paddingRight: '20px',
  justifyContent: 'space-between'
}));

const AssignmentSidebar = ({
  assignmentTitle,
  assignmentDescription,
  height,
  width,
  isLoading,
  hasGetUnstuck,
  setShowGetUnstuckModal
}: Props) => {
  if (isLoading) {
    return (
      <Container width={width} height={height}>
        <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
      </Container>
    );
  }
  return (
    <Container width={width} height={height}>
      <ColumnFlexDiv style={{ height: '85%' }}>
        <div style={{ maxHeight: '25%', lineHeight: 'normal' }}>
          <h1> {assignmentTitle} </h1>
        </div>
        <div style={{ height: '85%', overflowY: 'auto' }}>
          {/* eslint-disable-next-line react/no-children-prop */}
          <ReactMarkdown children={assignmentDescription} />
        </div>
      </ColumnFlexDiv>
      {hasGetUnstuck && (
        <Button variant="contained" onClick={() => setShowGetUnstuckModal(true)}>
          Get Unstuck
        </Button>
      )}
    </Container>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  width: string;
  height: string;
  isLoading: boolean;
  hasGetUnstuck?: boolean;
  setShowGetUnstuckModal: (show: boolean) => void;
};

export default AssignmentSidebar;
