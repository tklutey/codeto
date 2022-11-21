import React from 'react';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import { Skeleton } from '@mui/material';

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

const AssignmentSidebar = (props: Props) => {
  const { assignmentTitle, assignmentDescription, youtubeTutorialUrl, height, width, isLoading } = props;
  if (isLoading) {
    return (
      <Container width={width} height={height}>
        <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
      </Container>
    );
  }
  return (
    <Container width={width} height={height}>
      <ColumnFlexDiv style={{ height: '65%' }}>
        <div style={{ height: '15%' }}>
          <h1> {assignmentTitle} </h1>
        </div>
        <div style={{ height: '85%', overflowY: 'auto' }}>
          {/* eslint-disable-next-line react/no-children-prop */}
          <ReactMarkdown children={assignmentDescription} />
        </div>
      </ColumnFlexDiv>
      <ColumnFlexDiv style={{ height: '30%' }}>
        <div style={{ height: '25%' }}>
          <h2>Get Unstuck</h2>
        </div>
        <iframe
          src={youtubeTutorialUrl}
          width="100%"
          height="75%"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </ColumnFlexDiv>
    </Container>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  youtubeTutorialUrl?: string;
  width: string;
  height: string;
  isLoading: boolean;
};

export default AssignmentSidebar;
