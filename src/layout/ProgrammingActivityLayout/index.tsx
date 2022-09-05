import IDE from 'components/ide';
import React from 'react';

const ProgrammingActivityLayout = () => {
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', paddingTop: '55px' }}>
        <h1> Assignment Title </h1>
        <p> Make a linked list. </p>
      </div>
      <IDE width={'80%'} height={'100%'} />
    </div>
  );
};

export default ProgrammingActivityLayout;
