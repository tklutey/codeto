export enum TestType {
  regex = 'regex',
  unit_test = 'unit_test'
}

export const TEST_TYPES = [TestType.regex, TestType.unit_test];
export const testRegex = (testInput: string, testCode: string) => {
  return testInput.match(testCode) && testCode.length > 0;
};

export const testUnitTest = (testInput: string, testCode: string) => {
  const codeWithTests = testInput + `\n${testCode}`;
  return eval(codeWithTests);
};
