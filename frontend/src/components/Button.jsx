/**
 * Reusable Button Component
 * Calm, accessible button following neuro-inclusive design
 */

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = 'font-medium rounded-lg transition-calm focus-calm disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-calm-primary text-white hover:bg-calm-primaryHover',
    secondary: 'bg-white text-calm-text border-2 border-calm-border hover:border-calm-primary',
    success: 'bg-calm-success text-white hover:opacity-90',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
