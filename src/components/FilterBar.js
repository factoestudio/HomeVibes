import React from 'react';
import { WalletIcon } from './SvgIcons';

const PROPERTY_TYPES = ['Condo', 'House', 'Townhouse', 'Loft'];

export default function FilterBar({ filters, onChange }) {
  if (!filters) return null;
  const handleTypeToggle = (type) => {
    let newTypes;
    const currentTypes = filters.selectedTypes || ['Condo', 'House', 'Townhouse', 'Loft'];
    if (currentTypes.includes(type)) {
      if (currentTypes.length === 1) return; // Keep at least one selected
      newTypes = currentTypes.filter(t => t !== type);
    } else {
      newTypes = [...currentTypes, type];
    }
    onChange({ ...filters, selectedTypes: newTypes });
  };

  const handleTenureToggle = (tenureMode) => {
    // Reset maxPrice defaults when switching rent/buy
    const defaultPrice = tenureMode === 'rent' ? 2600 : 1100000;
    onChange({ 
      ...filters, 
      tenure: tenureMode,
      maxPrice: defaultPrice 
    });
  };

  const formatCurrencyLabel = (val) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
  };

  const rentOptions = [1500, 2000, 2500, 3000, 3500, 4000, 5000];
  const buyOptions = [500000, 750000, 1000000, 1250000, 1500000, 2000000, 3000000];
  const priceOptions = filters.tenure === 'rent' ? rentOptions : buyOptions;

  return (
    <div className="filter-bar card-glass luxury-border fade-in">
      <div className="filter-bar-inner">
        {/* Rent / Buy Toggle */}
        <div className="filter-group tenure-toggle-group">
          <button
            type="button"
            className={`filter-tenure-btn ${filters.tenure === 'rent' ? 'active' : ''}`}
            onClick={() => handleTenureToggle('rent')}
          >
            Rent
          </button>
          <button
            type="button"
            className={`filter-tenure-btn ${filters.tenure === 'buy' ? 'active' : ''}`}
            onClick={() => handleTenureToggle('buy')}
          >
            Buy
          </button>
        </div>

        {/* Max Budget Dropdown */}
        <div className="filter-group select-group">
          <span className="filter-group-icon gold-text"><WalletIcon size={14} /></span>
          <span className="filter-group-label uppercase">Max Price:</span>
          <select
            className="luxury-select"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          >
            {priceOptions.map(p => (
              <option key={p} value={p}>{formatCurrencyLabel(p)}{filters.tenure === 'rent' ? '/mo' : ''}</option>
            ))}
          </select>
        </div>

        {/* Beds Dropdown */}
        <div className="filter-group select-group">
          <span className="filter-group-label uppercase">Beds:</span>
          <select
            className="luxury-select"
            value={filters.beds}
            onChange={(e) => onChange({ ...filters, beds: Number(e.target.value) })}
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num === 4 ? '4+ Beds' : `${num}+ Beds`}</option>
            ))}
          </select>
        </div>

        {/* Baths Dropdown */}
        <div className="filter-group select-group">
          <span className="filter-group-label uppercase">Baths:</span>
          <select
            className="luxury-select"
            value={filters.baths}
            onChange={(e) => onChange({ ...filters, baths: Number(e.target.value) })}
          >
            {[1, 1.5, 2, 3].map(num => (
              <option key={num} value={num}>{num === 3 ? '3+ Baths' : `${num}+ Baths`}</option>
            ))}
          </select>
        </div>

        {/* Parking Space Toggle */}
        <div className="filter-group parking-checkbox-group">
          <label className="parking-checkbox-label">
            <input
              type="checkbox"
              checked={filters.parkingRequired}
              onChange={(e) => onChange({ ...filters, parkingRequired: e.target.checked })}
              className="luxury-checkbox"
            />
            <span className="checkbox-text uppercase">Parking</span>
          </label>
        </div>

        {/* Property Types Dropdown/Selector */}
        <div className="filter-group types-filter-group">
          <span className="filter-group-label uppercase">Type:</span>
          <div className="types-chips-wrap">
            {PROPERTY_TYPES.map(type => {
              const currentTypes = filters.selectedTypes || ['Condo', 'House', 'Townhouse', 'Loft'];
              const isSelected = currentTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  className={`type-chip-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleTypeToggle(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
