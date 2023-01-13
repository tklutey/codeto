import * as trpc from '@trpc/server';
import { z } from 'zod';
import SbClient from '../client/SbClient';

const transformMcProblems = (mcProblems: any) => {
  return mcProblems.map((mcProblem: any) => {
    const answerOptions = [
      mcProblem.mc_problem.option_a,
      mcProblem.mc_problem.option_b,
      mcProblem.mc_problem.option_c,
      mcProblem.mc_problem.option_d,
      mcProblem.mc_problem.option_e
    ];
    return {
      id: mcProblem.mc_problem.id,
      sequence: mcProblem.sequence,
      assessmentId: mcProblem.assessment_id,
      problem: {
        prompt: mcProblem.mc_problem.prompt,
        answerOptions: answerOptions,
        correctAnswer: mcProblem.mc_problem.correct_answer
      }
    };
  });
};
export const assessmentEngine = trpc.router().query('getAssessmentState', {
  input: z.string(),
  async resolve({ input }) {
    const { userId, unitNum, problemSequence } = JSON.parse(input);
    const sbClient = new SbClient();
    const assessmentStateList = await sbClient.getAssessmentState(unitNum, userId);
    const assessmentState = assessmentStateList ? assessmentStateList[0] : null;
    const mcProblems = assessmentState?.assessment_problem_relationship;
    if (problemSequence >= mcProblems.length) {
      return {
        status: 'COMPLETE'
      };
    }
    const transformedMcProblems = transformMcProblems(mcProblems);
    const nextProblem = transformedMcProblems?.find((p: any) => p.sequence === problemSequence);
    return {
      assessmentId: nextProblem.assessmentId,
      currentProblem: nextProblem.problem,
      problemsCompleted: problemSequence + 1,
      totalProblems: mcProblems.length,
      status: 'IN_PROGRESS'
    };
  }
});
