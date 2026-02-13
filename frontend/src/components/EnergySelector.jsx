/**
 * Energy Selector Component
 * Allows users to indicate their current energy level
 */

import { ENERGY_LEVELS } from '../utils/constants';
import { getEnergyLabel } from '../utils/helpers';

const EnergySelector = ({ selected, onChange, className = '' }) => {
  const energyOptions = [
    { value: ENERGY_LEVELS.LOW, label: getEnergyLabel(ENERGY_LEVELS.LOW) },
    { value: ENERGY_LEVELS.MEDIUM, label: getEnergyLabel(ENERGY_LEVELS.MEDIUM) },
    { value: ENERGY_LEVELS.HIGH, label: getEnergyLabel(ENERGY_LEVELS.HIGH) },
  ];

  return (
    <div className={className}>
      <label className="block text-sm text-calm-textLight mb-2">
        Current Energy Level (Optional)
      </label>
      <div className="flex gap-2">
        {energyOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-calm focus-calm ${
              selected === option.value
                ? 'border-calm-primary bg-calm-primary bg-opacity-10 text-calm-primary'
                : 'border-calm-border text-calm-text hover:border-calm-primary'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnergySelector;
