import * as trpc from '@trpc/server';

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
      expectedOutput: 'Hello, World'
    };
  }
});
