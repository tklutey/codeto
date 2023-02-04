import { FooterConfig } from '../../types/programmingActivity';
import AssignmentFooter from '../../components/assignment/AssignmentFooter';
import AssessmentFooter from '../../components/assessment/AssessmentFooter';
import { MasteryStatus } from '../../server/types';

const ProgrammingActivityFooter = ({
  footerConfig,
  handleGoToNextProblem,
  masteryStatus,
  isAdaptiveMode,
  isNextButtonEnabled,
  onSkipClicked
}: Props) => {
  if (footerConfig.type === 'Learning') {
    return (
      <AssignmentFooter
        disabled={!isNextButtonEnabled}
        onNextClicked={handleGoToNextProblem}
        onSkipClicked={onSkipClicked}
        masteryStatus={masteryStatus}
        isAdaptiveMode={isAdaptiveMode}
      />
    );
  } else {
    return <AssessmentFooter disabled={!isNextButtonEnabled} onNextClicked={handleGoToNextProblem} />;
  }
};

export default ProgrammingActivityFooter;

type Props = {
  footerConfig: FooterConfig;
  isNextButtonEnabled: boolean;
  handleGoToNextProblem?: () => void;
  onSkipClicked: () => void;
  masteryStatus?: MasteryStatus;
  isAdaptiveMode?: boolean;
};
