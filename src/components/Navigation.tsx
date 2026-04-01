interface NavigationProps {
  activeTab: 'home' | 'upload' | 'dashboard' | 'analysis';
  onTabChange: (tab: 'home' | 'upload' | 'dashboard' | 'analysis') => void;
  hasData: boolean;
}

export default function Navigation({ activeTab, onTabChange, hasData }: NavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: '🏠' },
    { id: 'upload' as const, label: 'Upload Dataset', icon: '📤' },
    { id: 'dashboard' as const, label: 'Dashboard', icon: '📊', disabled: !hasData },
    { id: 'analysis' as const, label: 'Analysis', icon: '🔍', disabled: !hasData }
  ];

  return (
    <nav className="navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
