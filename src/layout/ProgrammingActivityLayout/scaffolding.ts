import { MasteryStatus } from 'server/types';

export type ScaffoldingConfiguration = {
  hasSolution: boolean;
  // @TODO: add this into scaffolding
  hasErrorHints: boolean;
  hasVideo: boolean;
  hasChat: boolean;
  hasGetUnstuck: boolean;
  testLimit?: number;
};

export const getScaffoldingConfiguration = (masteryStatus: MasteryStatus) => {
  switch (masteryStatus) {
    case MasteryStatus.Unattempted:
      return {
        hasSolution: true,
        hasErrorHints: true,
        hasGetUnstuck: true,
        hasVideo: true,
        hasChat: true
      };
    case MasteryStatus.Learned:
      return {
        hasSolution: false,
        hasErrorHints: true,
        hasGetUnstuck: true,
        testLimit: 5,
        hasVideo: true,
        hasChat: true
      };
    case MasteryStatus.Practiced:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasGetUnstuck: false,
        testLimit: 3,
        hasVideo: true,
        hasChat: true
      };
    default:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasGetUnstuck: false,
        hasVideo: true,
        hasChat: true
      };
  }
};
