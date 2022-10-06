import IDE from 'components/ide';
import React from 'react';
import { ExerciseTests } from 'server/routers/codingProblem';
import { styled } from '@mui/material/styles';

const ColumnFlexDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'flex-start'
});

const ProgrammingActivityLayout = (props: Props) => {
  const { assignmentTitle, assignmentDescription, language, startingCode, tests, youtubeTutorialUrl } = props;
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
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
      <IDE width={'80%'} height={'100%'} language={language} startingCode={startingCode} tests={tests} />
    </div>
  );
};

type Props = {
  assignmentTitle: string;
  assignmentDescription: string;
  language: string;
  startingCode?: string;
  tests?: ExerciseTests;
  youtubeTutorialUrl?: string;
};

export default ProgrammingActivityLayout;
