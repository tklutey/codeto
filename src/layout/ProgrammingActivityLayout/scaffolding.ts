import { MasteryStatus } from 'server/types';

export type ScaffoldingConfiguration = {
  hasSolution: boolean;
  hasErrorHints: boolean;
  hasVideo: boolean;
  testLimit?: number;
};

export const getScaffoldingConfiguration = (masteryStatus: MasteryStatus) => {
  switch (masteryStatus) {
    case MasteryStatus.Unattempted:
      return {
        hasSolution: true,
        hasErrorHints: true,
        hasVideo: true
      };
    case MasteryStatus.Learned:
      return {
        hasSolution: false,
        hasErrorHints: true,
        hasVideo: true,
        testLimit: 5
      };
    case MasteryStatus.Practiced:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasVideo: false,
        testLimit: 3
      };
    default:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasVideo: false
      };
  }
};
