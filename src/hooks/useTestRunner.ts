import { useState } from 'react';
import { TestResult } from 'components/ide';
import { CodingProblemTest } from 'server/routers/codingProblem';

const useTestRunner = (
  tests: CodingProblemTest[],
  stdIn: string,
  onAllTestsPassed: () => void,
  executeCode: (onOutput: (output: string) => void) => Promise<void>
) => {
  const [suites, setSuites] = useState<TestResult[]>();

  const runTestSuite = (testSuite: CodingProblemTest[], stringToMatch: string): TestResult[] => {
    return testSuite.map((test) => {
      if (test.test_type === 'regex') {
        const status = stringToMatch.match(test.test_code) ? 'pass' : 'fail';
        return { status: status, message: test.test_message };
      } else {
        return { status: 'fail', message: 'Unknown test type' };
      }
    });
  };

  const runAndPush = (testResults: TestResult[], testSuite: CodingProblemTest[], stringToMatch: string) => {
    const expectedOutputTestResults: TestResult[] = runTestSuite(testSuite, stringToMatch);
    testResults.push(...expectedOutputTestResults);
  };

  const allTestsPassed = (testResults: TestResult[]) => {
    return testResults.every((result) => result.status === 'pass');
  };

  const handleTestCode = async () => {
    const testResults: TestResult[] = [];
    const stdInTests = tests?.filter((test) => test.source_type === 'stdin');
    const stdOutTests = tests?.filter((test) => test.source_type === 'stdout');
    if (stdInTests && stdInTests.length > 0) {
      runAndPush(testResults, stdInTests, stdIn || '');
    }
    await executeCode((output) => {
      if (stdOutTests && stdOutTests.length > 0) {
        runAndPush(testResults, stdOutTests, output);
      }
      const status = output.match('error') ? 'fail' : 'pass';
      testResults.push({ status: status, message: 'The test runs without any errors.' });
    });
    if (allTestsPassed(testResults) && onAllTestsPassed) {
      onAllTestsPassed();
    }
    if (testResults.length > 0) {
      setSuites(testResults);
    } else {
      setSuites([
        {
          status: 'pass',
          message: 'No tests found'
        }
      ]);
    }
  };

  return {
    suites,
    resetTestSuites: () => setSuites([]),
    handleTestCode
  };
};

export default useTestRunner;
