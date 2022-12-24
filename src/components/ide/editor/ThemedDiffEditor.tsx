import { DiffEditor } from '@monaco-editor/react';
import { CodeEditorOptions } from 'components/ide/editor/CodeEditorOptions';

const ThemedDiffEditor = (props: Props) => {
  const { originalCode, modifiedCode, language, updateCode } = props;

  return (
    <DiffEditor
      language={language}
      original={originalCode}
      modified={modifiedCode}
      onMount={(editor, monacoA) => {
        editor.getModifiedEditor().onDidChangeModelContent(() => {
          updateCode(editor.getModifiedEditor().getValue());
        });
      }}
      width={'100%'}
      height={'75%'}
      theme={'vs-dark'}
      options={CodeEditorOptions}
    />
  );
};

type Props = {
  language: string;
  originalCode?: string;
  modifiedCode?: string;
  updateCode: (newCode?: string, _?: any) => void;
};

export default ThemedDiffEditor;
