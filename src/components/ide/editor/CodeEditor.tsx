import MonacoEditor from '@monaco-editor/react';
import React from 'react';
import { CodeEditorOptions } from 'components/ide/editor/CodeEditorOptions';
import { Box, Skeleton } from '@mui/material';

const CodeEditor = ({ updateCode, language, startingCode, isLoading, ...rest }: Props) => {
  const Loading = () => <Skeleton variant="rectangular" width={'100%'} height={'100%'} />;
  const Editor = (
    <MonacoEditor
      defaultLanguage={language}
      value={startingCode}
      loading={<Loading />}
      onChange={updateCode}
      theme={'vs-dark'}
      options={CodeEditorOptions}
    />
  );
  return <Box {...rest}>{isLoading ? <Loading /> : Editor}</Box>;
};

type Props = {
  updateCode?: (newCode?: string, _?: any) => void;
  startingCode?: string;
  language: string;
  width?: string;
  height?: string;
  isLoading?: boolean;
};

export default CodeEditor;
