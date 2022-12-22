import { MasteryStatus } from 'server/types';

export type ScaffoldingConfiguration = {
  hasSolution: boolean;
  // @TODO: add this into scaffolding
  hasErrorHints: boolean;
  hasGetUnstuck: boolean;
  testLimit?: number;
};

export const getScaffoldingConfiguration = (masteryStatus: MasteryStatus) => {
  switch (masteryStatus) {
    case MasteryStatus.Unattempted:
      return {
        hasSolution: true,
        hasErrorHints: true,
        hasGetUnstuck: true
      };
    case MasteryStatus.Learned:
      return {
        hasSolution: false,
        hasErrorHints: true,
        hasGetUnstuck: true,
        testLimit: 5
      };
    case MasteryStatus.Practiced:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasGetUnstuck: false,
        testLimit: 3
      };
    default:
      return {
        hasSolution: false,
        hasErrorHints: false,
        hasGetUnstuck: false
      };
  }
};
