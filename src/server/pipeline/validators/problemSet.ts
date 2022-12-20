export const problemSetOutputValidator = (problemSets: any[]) => {
  // iterate through problemSets with a for loop
  let missingProblemsCount = 0;
  for (let i = 0; i < problemSets.length; i++) {
    const codingProblems = problemSets[i].coding_problems;
    if (codingProblems.length < 3) {
      missingProblemsCount++;
    }
  }
  if (missingProblemsCount > 0) {
    console.warn(`There are ${missingProblemsCount} problem sets with less than 3 problems`);
  }
  return problemSets;
};
