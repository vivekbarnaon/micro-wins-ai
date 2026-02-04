/**
 * Format step number display
 * @param {number} current - Current step number
 * @param {number} total - Total number of steps
 * @returns {string} Formatted string "Step X of Y"
 */
export const formatStepNumber = (current, total) => {
  return `Step ${current} of ${total}`;
};

/**
 * Calculate progress percentage
 * @param {number} current - Current step number
 * @param {number} total - Total number of steps
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (current, total) => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Get energy level label
 * @param {string} level - Energy level key
 * @returns {string} Human-readable label
 */
export const getEnergyLabel = (level) => {
  const labels = {
    low: 'Low Energy',
    medium: 'Medium Energy',
    high: 'High Energy',
  };
  return labels[level] || level;
};

/**
 * Get step size label
 * @param {string} size - Step size key
 * @returns {string} Human-readable label
 */
export const getStepSizeLabel = (size) => {
  const labels = {
    micro: 'Micro Steps',
    normal: 'Normal Steps',
    macro: 'Macro Steps',
  };
  return labels[size] || size;
};
