export enum ProblemAttemptStatus {
  Correct = 'correct',
  Incorrect = 'incorrect',
  Skipped = 'skipped',
  ScaffoldingUsed = 'scaffolding_used'
}

// Create ordered enum call mastery status
export enum MasteryStatus {
  Unattempted = 0,
  Learned = 1,
  Practiced = 2,
  Mastered = 3,
  Failed = 4
}

export const convertMasteryStatusToString = (masteryStatus: MasteryStatus) => {
  switch (masteryStatus) {
    case MasteryStatus.Unattempted:
      return 'Unattempted';
    case MasteryStatus.Learned:
      return 'Learned';
    case MasteryStatus.Practiced:
      return 'Practiced';
    case MasteryStatus.Mastered:
      return 'Mastered';
    case MasteryStatus.Failed:
      return 'Failed';
    default:
      return 'Unattempted';
  }
};
export const getMasteryStatusByValue = (value: number) => {
  switch (value) {
    case 0:
      return MasteryStatus.Unattempted;
    case 1:
      return MasteryStatus.Learned;
    case 2:
      return MasteryStatus.Practiced;
    case 3:
      return MasteryStatus.Mastered;
    default:
      return MasteryStatus.Unattempted;
  }
};

export const getMasteryStatusByKey = (key: string) => {
  switch (key) {
    case 'Unattempted':
      return MasteryStatus.Unattempted;
    case 'Learned':
      return MasteryStatus.Learned;
    case 'Practiced':
      return MasteryStatus.Practiced;
    case 'Mastered':
      return MasteryStatus.Mastered;
    default:
      return MasteryStatus.Unattempted;
  }
};
