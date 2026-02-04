/**
 * Progress Bar Component
 * Subtle visual indicator of task progress
 */

const ProgressBar = ({ current, total, className = '' }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="h-2 bg-calm-border rounded-full overflow-hidden">
        <div 
          className="h-full bg-calm-primary transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin="0"
          aria-valuemax={total}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
