import * as trpc from '@trpc/server';

export type TestInstance = {
  summary: string;
  matchRegex: string;
};
export type ExerciseTests = {
  expectedOutput: TestInstance[];
  expectedSourceCode: TestInstance[];
};
export const lesson = trpc.router().query('get', {
  resolve() {
    return {
      assignmentTitle: 'Hello World',
      assignmentDescription: 'Write a program that prints "Hello World" to the console.',
      language: 'java',
      startingCode: `
public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}
    `,
      expectedOutput: 'Hello, World',
      tests: {
        expectedOutput: [{ summary: 'The code outputs "Hello, World".', matchRegex: 'Hello, World' }],
        expectedSourceCode: [{ summary: 'The code contains "Hello, World".', matchRegex: 'Hello, World' }]
      }
    };
  }
});
