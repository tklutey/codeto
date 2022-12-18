// Create ordered enum call mastery status
export enum IMasteryStatus {
  Unattempted = 0,
  Learned = 1,
  Applied = 2,
  Mastered = 3
}

export const getMasteryStatusByValue = (value: number) => {
  switch (value) {
    case 0:
      return IMasteryStatus.Unattempted;
    case 1:
      return IMasteryStatus.Learned;
    case 2:
      return IMasteryStatus.Applied;
    case 3:
      return IMasteryStatus.Mastered;
    default:
      return IMasteryStatus.Unattempted;
  }
};
