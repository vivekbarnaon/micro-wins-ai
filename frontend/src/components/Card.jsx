/**
 * Reusable Card Component
 * Clean, minimal card with soft shadow
 */

const Card = ({ 
  children, 
  className = '',
  padding = 'default',
}) => {
  const paddings = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <div className={`bg-calm-card dark:bg-gray-800 rounded-xl shadow-calm border border-transparent dark:border-gray-700 transition-colors duration-300 ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
