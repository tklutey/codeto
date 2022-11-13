import { DiffEditor } from '@monaco-editor/react';
import { CodeEditorOptions } from 'components/ide/editor/CodeEditorOptions';

const ThemedDiffEditor = (props: Props) => {
  const { originalCode, modifiedCode, language } = props;
  return (
    <DiffEditor
      language={language}
      original={originalCode}
      modified={modifiedCode}
      width={'100%'}
      height={'90%'}
      theme={'vs-dark'}
      options={CodeEditorOptions}
    />
  );
};

type Props = {
  language: string;
  originalCode?: string;
  modifiedCode?: string;
};

export default ThemedDiffEditor;
