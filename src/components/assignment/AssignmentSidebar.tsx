import React from 'react';
import { styled } from '@mui/material/styles';

const ColumnFlexDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start'
});

const AssignmentSidebar = (props: Props) => {
  const { assignmentTitle, assignmentDescription, youtubeTutorialUrl } = props;
  return (
    <div
      style={{
        width: '20%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        paddingTop: '55px',
        paddingRight: '20px',
        justifyContent: 'space-between'
      }}
    >
      <ColumnFlexDiv>
        <h1> {assignmentTitle} </h1>
        <p> {assignmentDescription} </p>
      </ColumnFlexDiv>
      <ColumnFlexDiv>
        <h2>Get Unstuck</h2>
        <iframe
          src={youtubeTutorialUrl}
          width="100%"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </ColumnFlexDiv>
    </div>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  youtubeTutorialUrl?: string;
};

export default AssignmentSidebar;
