import React from 'react';
import { SunIcon, MoonIcon, MonitorIcon } from './SvgIcons';

const ThemeSelector = ({ theme, setTheme }) => {
  return (
    <div className="theme-selector-container card-glass luxury-border">
      <button 
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`} 
        onClick={() => setTheme('light')}
        title="Light Mode"
      >
        <SunIcon size={18} />
      </button>
      
      <button 
        className={`theme-btn ${theme === 'auto' ? 'active' : ''}`} 
        onClick={() => setTheme('auto')}
        title="Auto (System Sync)"
      >
        <MonitorIcon size={18} />
      </button>

      <button 
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} 
        onClick={() => setTheme('dark')}
        title="Dark Mode"
      >
        <MoonIcon size={18} />
      </button>
    </div>
  );
};

export default ThemeSelector;
