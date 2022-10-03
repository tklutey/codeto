import * as trpc from '@trpc/server';

export type ExerciseTests = {
  expectedOutput: {
    summary: string;
    matchRegex: string;
  }[];
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
        expectedOutput: [{ summary: 'The code outputs "Hello, World".', matchRegex: 'Hello, World' }]
      }
    };
  }
});
