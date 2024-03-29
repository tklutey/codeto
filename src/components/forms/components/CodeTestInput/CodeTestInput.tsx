import TestInputRow from 'components/forms/components/CodeTestInput/TestInputRow';
import { Box, Button } from '@mui/material';

const EMPTY_TEST_ROW = { message: '', testCode: '' };
const CodeTestInput = ({ tests, setTests, testInput }: Props) => {
  const handleClick = () => {
    setTests((prevTests) => [...prevTests, EMPTY_TEST_ROW]);
  };
  const handleChange = (index: number) => {
    return (test: any) => {
      setTests((prevTests) => {
        const newTests = [...prevTests];
        newTests[index] = test;
        return newTests;
      });
    };
  };
  return (
    <Box>
      <Box width={'100%'} display={'flex'}>
        {tests.map((test, index) => (
          <TestInputRow key={index} message={test.message} testCode={test.testCode} onChange={handleChange(index)} testInput={testInput} />
        ))}
      </Box>
      <Button onClick={handleClick}>Add Test</Button>
    </Box>
  );
};

type Props = {
  tests: any[];
  setTests: (callback: (prevTests: any) => any[]) => void;
  testInput: string;
};

export default CodeTestInput;
