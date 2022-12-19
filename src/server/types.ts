// Create ordered enum call mastery status
export enum MasteryStatus {
  Unattempted = 0,
  Learned = 1,
  Practiced = 2,
  Mastered = 3
}

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
