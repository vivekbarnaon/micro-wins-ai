/**
 * MicroWins Logo Component
 * Unique, minimal logo representing micro steps/wins
 */

const Logo = ({ size = 64, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="32" cy="32" r="32" fill="currentColor" className="text-calm-primary" />
      
      {/* Three ascending steps - representing micro wins */}
      <g className="text-white">
        {/* Step 1 - Small */}
        <rect x="14" y="40" width="10" height="10" rx="2" fill="currentColor" opacity="0.6" />
        
        {/* Step 2 - Medium */}
        <rect x="27" y="32" width="10" height="18" rx="2" fill="currentColor" opacity="0.8" />
        
        {/* Step 3 - Large with checkmark */}
        <rect x="40" y="20" width="10" height="30" rx="2" fill="currentColor" />
        
        {/* Checkmark on top step */}
        <path
          d="M43 25L45 27L48 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-calm-primary"
        />
      </g>
      
      {/* Small sparkle effect */}
      <circle cx="52" cy="16" r="2" fill="white" opacity="0.8" />
      <circle cx="56" cy="20" r="1.5" fill="white" opacity="0.6" />
    </svg>
  );
};

export default Logo;
