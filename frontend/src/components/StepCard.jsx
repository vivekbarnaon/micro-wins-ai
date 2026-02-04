/**
 * Step Card Component
 * Displays one task step at a time with clear formatting
 */

import Card from './Card';
import ProgressBar from './ProgressBar';
import { formatStepNumber } from '../utils/helpers';

const StepCard = ({ 
  stepNumber, 
  totalSteps, 
  stepText, 
  showProgress = true,
  className = '' 
}) => {
  return (
    <Card padding="large" className={className}>
      {showProgress && (
        <div className="mb-6">
          <p className="text-sm text-calm-textLight mb-2">
            {formatStepNumber(stepNumber, totalSteps)}
          </p>
          <ProgressBar current={stepNumber} total={totalSteps} />
        </div>
      )}
      
      <div className="text-center">
        <p className="text-2xl md:text-3xl leading-relaxed text-calm-text">
          {stepText}
        </p>
      </div>
    </Card>
  );
};

export default StepCard;
