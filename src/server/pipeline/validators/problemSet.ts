export const problemSetOutputValidator = (problemSets: any[]) => {
  problemSets.forEach((ps) => {
    const codingProblems = ps.coding_problems;
    if (codingProblems.length < 3) {
      console.warn('Problem set ID ' + ps.id + ' has less than 3 problems');
    }
  });
  return problemSets;
};
