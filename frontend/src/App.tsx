import React, { useState, useCallback, useRef } from 'react';
import { Plus, X, Download, Eye, Settings, Layers, Filter, BarChart3, Save, Upload, Copy, Trash2, Edit2, ArrowRight, HelpCircle, Zap, Grid, PieChart, TrendingUp } from 'lucide-react';

// Enhanced UI Components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  loading = false,
  children, 
  className = '', 
  disabled,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm hover:shadow-md',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
  };
  
  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'xs' ? 12 : size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  gradient = false
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  return (
    <div className={`
      ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-white'}
      border border-gray-200 rounded-xl shadow-sm
      ${hover ? 'hover:shadow-lg hover:border-gray-300 hover:-translate-y-0.5' : ''}
      ${paddingClasses[padding]}
      transition-all duration-300
      ${className}
    `}>
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <input
          {...props}
          className={`
            block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 border border-gray-300 rounded-lg
            placeholder-gray-400 text-gray-900 bg-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
        />
      </div>
      {error && <p className="text-sm text-red-600 flex items-center gap-1"><X size={14} />{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, options, value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'sm' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variants[variant]} ${sizes[size]}
    `}>
      {children}
    </span>
  );
};

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

// Enhanced Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full sm:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

// Types
interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'pie' | 'area' | 'histogram' | 'heatmap';
  title: string;
  x: string;
  y: string;
  group_by?: string;
  color?: string;
  description?: string;
}

interface FilterConfig {
  type: 'dropdown' | 'multichoice' | 'date_range' | 'slider' | 'text_box';
  label: string;
  id: string;
  options?: string[];
  placeholder?: string;
}

interface SectionConfig {
  charts: ChartConfig[];
  title?: string;
}

interface LayoutConfig {
  layout: 'minimal-reports' | 'jacket-reports';
  cards: string[];
  filters: FilterConfig[];
  alleys?: SectionConfig[];
  lanes?: SectionConfig[];
  include_table: boolean;
  theme?: 'light' | 'dark';
}

const DashboardBuilder: React.FC = () => {
  const [config, setConfig] = useState<LayoutConfig>({
    layout: 'minimal-reports',
    cards: [],
    filters: [],
    alleys: [],
    include_table: false,
    theme: 'light',
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'preview'>('basic');
  
  // Modal states
  const [showCardModal, setShowCardModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState<{ sectionIndex: number } | null>(null);
  const [editingCard, setEditingCard] = useState<{ index: number; name: string } | null>(null);

  // Form states
  const [newCard, setNewCard] = useState('');
  const [newFilter, setNewFilter] = useState<Partial<FilterConfig>>({});
  const [newChart, setNewChart] = useState<Partial<ChartConfig>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = useCallback((updates: Partial<LayoutConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Enhanced card management
  const handleAddCard = () => {
    if (newCard.trim()) {
      updateConfig({ cards: [...config.cards, newCard.trim()] });
      setNewCard('');
      setShowCardModal(false);
    }
  };

  const handleEditCard = (index: number, name: string) => {
    const newCards = [...config.cards];
    newCards[index] = name;
    updateConfig({ cards: newCards });
    setEditingCard(null);
  };

  const removeCard = useCallback((index: number) => {
    const newCards = config.cards.filter((_, i) => i !== index);
    updateConfig({ cards: newCards });
  }, [config.cards, updateConfig]);

  // Enhanced filter management
  const handleAddFilter = () => {
    if (newFilter.label && newFilter.type && newFilter.id) {
      updateConfig({
        filters: [...config.filters, newFilter as FilterConfig]
      });
      setNewFilter({});
      setShowFilterModal(false);
    }
  };

  const removeFilter = useCallback((index: number) => {
    const newFilters = config.filters.filter((_, i) => i !== index);
    updateConfig({ filters: newFilters });
  }, [config.filters, updateConfig]);

  const addSection = useCallback(() => {
    const sectionKey = config.layout === 'minimal-reports' ? 'alleys' : 'lanes';
    const currentSections = config[sectionKey] || [];
    updateConfig({
      [sectionKey]: [...currentSections, { charts: [], title: `${config.layout === 'minimal-reports' ? 'Alley' : 'Lane'} ${currentSections.length + 1}` }]
    });
  }, [config.layout, config.alleys, config.lanes, updateConfig]);

  // Enhanced chart management
  const handleAddChart = (sectionIndex: number) => {
    if (newChart.title && newChart.type && newChart.x && newChart.y) {
      const sectionKey = config.layout === 'minimal-reports' ? 'alleys' : 'lanes';
      const sections = [...(config[sectionKey] || [])];
      sections[sectionIndex].charts.push({
        ...newChart as ChartConfig,
        color: newChart.color || '#3b82f6'
      });
      updateConfig({ [sectionKey]: sections });
      setNewChart({});
      setShowChartModal(null);
    }
  };

  const removeChart = useCallback((sectionIndex: number, chartIndex: number) => {
    const sectionKey = config.layout === 'minimal-reports' ? 'alleys' : 'lanes';
    const sections = [...(config[sectionKey] || [])];
    sections[sectionIndex].charts.splice(chartIndex, 1);
    updateConfig({ [sectionKey]: sections });
  }, [config.layout, config.alleys, config.lanes, updateConfig]);

  // Quick start templates
  const applyTemplate = (template: 'sales' | 'analytics' | 'operations') => {
    const templates = {
      sales: {
        layout: 'minimal-reports' as const,
        cards: ['Total Revenue', 'Sales Growth', 'Conversion Rate', 'Active Customers'],
        filters: [
          { type: 'date_range' as const, label: 'Date Range', id: 'date_filter' },
          { type: 'dropdown' as const, label: 'Region', id: 'region_filter', options: ['North', 'South', 'East', 'West'] }
        ],
        alleys: [
          {
            title: 'Sales Overview',
            charts: [
              { type: 'bar' as const, title: 'Monthly Revenue', x: 'month', y: 'revenue', color: '#10b981' },
              { type: 'line' as const, title: 'Sales Trend', x: 'date', y: 'sales', color: '#3b82f6' }
            ]
          }
        ],
        include_table: true
      },
      analytics: {
        layout: 'jacket-reports' as const,
        cards: ['Page Views', 'Unique Visitors', 'Bounce Rate', 'Session Duration'],
        filters: [
          { type: 'date_range' as const, label: 'Date Range', id: 'date_filter' },
          { type: 'multichoice' as const, label: 'Traffic Source', id: 'source_filter' }
        ],
        lanes: [
          {
            title: 'Traffic Analytics',
            charts: [
              { type: 'area' as const, title: 'Traffic Over Time', x: 'date', y: 'visitors', color: '#8b5cf6' },
              { type: 'pie' as const, title: 'Traffic Sources', x: 'source', y: 'count', color: '#f59e0b' }
            ]
          }
        ],
        include_table: false
      },
      operations: {
        layout: 'minimal-reports' as const,
        cards: ['Active Tasks', 'Completion Rate', 'Team Efficiency', 'Resource Utilization'],
        filters: [
          { type: 'dropdown' as const, label: 'Department', id: 'dept_filter' },
          { type: 'slider' as const, label: 'Priority Level', id: 'priority_filter' }
        ],
        alleys: [
          {
            title: 'Operations Dashboard',
            charts: [
              { type: 'histogram' as const, title: 'Task Distribution', x: 'priority', y: 'count', color: '#ef4444' },
              { type: 'heatmap' as const, title: 'Resource Usage', x: 'hour', y: 'resource', color: '#06b6d4' }
            ]
          }
        ],
        include_table: true
      }
    };

    updateConfig(templates[template]);
    setShowQuickStart(false);
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simple download
      const configJson = JSON.stringify(config, null, 2);
      const blob = new Blob([`// Generated Dashboard Configuration\nexport const dashboardConfig = ${configJson};`], 
        { type: 'text/javascript' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.layout === 'minimal-reports' ? 'Minimal' : 'Jacket'}Dashboard.tsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Error generating code: ' + error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-config.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImportConfig = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target?.result as string);
          updateConfig(importedConfig);
        } catch (error) {
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  const sections = config.layout === 'minimal-reports' ? config.alleys : config.lanes;
  const sectionName = config.layout === 'minimal-reports' ? 'Alley' : 'Lane';

  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'histogram', label: 'Histogram' },
    { value: 'heatmap', label: 'Heatmap' }
  ];

  const filterTypeOptions = [
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'multichoice', label: 'Multi-choice' },
    { value: 'date_range', label: 'Date Range' },
    { value: 'slider', label: 'Slider' },
    { value: 'text_box', label: 'Text Box' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Quick Start Modal */}
      {showQuickStart && (
        <Modal isOpen={showQuickStart} onClose={() => setShowQuickStart(false)} title="Quick Start" size="lg">
          <div className="space-y-6">
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Get Started Quickly</h3>
              <p className="text-gray-600">Choose a template to jumpstart your dashboard creation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card hover className="cursor-pointer" onClick={() => applyTemplate('sales')}>
                <div className="text-center p-4">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Sales Dashboard</h4>
                  <p className="text-sm text-gray-500 mt-1">Revenue, growth, and sales metrics</p>
                </div>
              </Card>
              
              <Card hover className="cursor-pointer" onClick={() => applyTemplate('analytics')}>
                <div className="text-center p-4">
                  <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Analytics Dashboard</h4>
                  <p className="text-sm text-gray-500 mt-1">Traffic, engagement, and user data</p>
                </div>
              </Card>
              
              <Card hover className="cursor-pointer" onClick={() => applyTemplate('operations')}>
                <div className="text-center p-4">
                  <Grid className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900">Operations Dashboard</h4>
                  <p className="text-sm text-gray-500 mt-1">Tasks, efficiency, and resources</p>
                </div>
              </Card>
            </div>
            
            <div className="text-center">
              <Button variant="ghost" onClick={() => setShowQuickStart(false)}>
                Start from scratch
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Dashboard Builder Pro
                  </h1>
                  <p className="text-sm text-gray-500">Create stunning, interactive dashboards</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tooltip content="Import configuration">
                <Button variant="ghost" icon={Upload} onClick={handleImportConfig} />
              </Tooltip>
              
              <Tooltip content="Export configuration">
                <Button variant="ghost" icon={Copy} onClick={handleExportConfig} />
              </Tooltip>
              
              <Button
                variant="ghost"
                icon={Eye}
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              
              <Button
                variant="secondary"
                icon={Save}
                size="md"
              >
                Save Template
              </Button>

              <Button
                variant="primary"
                icon={Download}
                onClick={handleGenerateCode}
                loading={isGenerating}
                size="md"
              >
                {isGenerating ? 'Generating...' : 'Generate Code'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'basic', label: 'Basic Setup', icon: Grid },
                { id: 'advanced', label: 'Advanced Options', icon: Settings },
                { id: 'preview', label: 'Live Preview', icon: Eye }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'basic' && (
              <>
                {/* Layout Selection */}
                <Card gradient hover>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-blue-500" />
                      Layout Type
                      <Tooltip content="Choose between horizontal (minimal) or vertical (jacket) layouts">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {([
                        { 
                          value: 'minimal-reports', 
                          label: 'Minimal Reports', 
                          description: 'Clean horizontal layout with sidebar filters',
                          icon: '📊'
                        },
                        { 
                          value: 'jacket-reports', 
                          label: 'Jacket Reports', 
                          description: 'Comprehensive vertical layout with top filters',
                          icon: '📈'
                        }
                      ]).map((layoutType) => (
                        <button
                          key={layoutType.value}
                          onClick={() => updateConfig({ layout: layoutType.value as any })}
                          className={`
                            p-4 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105
                            ${config.layout === layoutType.value 
                              ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{layoutType.icon}</span>
                            <div className="font-semibold">{layoutType.label}</div>
                          </div>
                          <div className="text-sm text-gray-600">{layoutType.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Enhanced Cards Section */}
                <Card gradient hover>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-green-500" />
                        Metric Cards
                        <Badge variant="info">{config.cards.length}</Badge>
                      </h3>
                      <Button
                        variant="outline"
                        icon={Plus}
                        onClick={() => setShowCardModal(true)}
                        size="sm"
                      >
                        Add Card
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {config.cards.map((card, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-white" />
                          </div>
                          {editingCard?.index === index ? (
                            <div className="flex-1 flex gap-2">
                              <Input
                                value={editingCard.name}
                                onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleEditCard(index, editingCard.name)}
                                className="flex-1"
                                autoFocus
                              />
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleEditCard(index, editingCard.name)}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{card}</div>
                                <div className="text-sm text-gray-500">Metric card #{index + 1}</div>
                              </div>
                              <div className="flex gap-1">
                                <Tooltip content="Edit card">
                                  <Button
                                    variant="ghost"
                                    icon={Edit2}
                                    onClick={() => setEditingCard({ index, name: card })}
                                    size="xs"
                                  />
                                </Tooltip>
                                <Tooltip content="Remove card">
                                  <Button
                                    variant="ghost"
                                    icon={Trash2}
                                    onClick={() => removeCard(index)}
                                    size="xs"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  />
                                </Tooltip>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {config.cards.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                          <BarChart3 className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">No metric cards yet</p>
                          <p className="text-sm mb-4">Cards display key performance indicators</p>
                          <Button variant="outline" icon={Plus} onClick={() => setShowCardModal(true)} size="sm">
                            Add Your First Card
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Enhanced Filters Section */}
                <Card gradient hover>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-purple-500" />
                        Interactive Filters
                        <Badge variant="info">{config.filters.length}</Badge>
                      </h3>
                      <Button
                        variant="outline"
                        icon={Plus}
                        onClick={() => setShowFilterModal(true)}
                        size="sm"
                      >
                        Add Filter
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {config.filters.map((filter, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <Filter className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{filter.label}</div>
                            <div className="text-sm text-gray-500">
                              <Badge variant="default" size="sm">{filter.type}</Badge>
                              <span className="ml-2">ID: {filter.id}</span>
                            </div>
                          </div>
                          <Tooltip content="Remove filter">
                            <Button
                              variant="ghost"
                              icon={Trash2}
                              onClick={() => removeFilter(index)}
                              size="xs"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            />
                          </Tooltip>
                        </div>
                      ))}

                      {config.filters.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                          <Filter className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">No filters configured</p>
                          <p className="text-sm mb-4">Filters allow users to interact with data</p>
                          <Button variant="outline" icon={Plus} onClick={() => setShowFilterModal(true)} size="sm">
                            Add Your First Filter
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                {/* Enhanced Sections */}
                <Card gradient hover>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Grid className="w-5 h-5 text-blue-500" />
                        Chart {sectionName}s
                        <Badge variant="info">{sections?.length || 0}</Badge>
                      </h3>
                      <Button
                        variant="outline"
                        icon={Plus}
                        onClick={addSection}
                        size="sm"
                      >
                        Add {sectionName}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {sections?.map((section, sectionIndex) => (
                        <Card key={sectionIndex} padding="sm" className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {sectionIndex + 1}
                                </div>
                                {section.title || `${sectionName} ${sectionIndex + 1}`}
                                <Badge variant="success" size="sm">
                                  {section.charts.length} charts
                                </Badge>
                              </h4>
                              <Button
                                variant="outline"
                                icon={Plus}
                                onClick={() => setShowChartModal({ sectionIndex })}
                                size="xs"
                              >
                                Add Chart
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {section.charts.map((chart, chartIndex) => (
                                <div key={chartIndex} className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{chart.title}</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        <Badge variant="default" size="sm">{chart.type}</Badge>
                                        <span className="ml-2">X: {chart.x} • Y: {chart.y}</span>
                                      </div>
                                    </div>
                                    <Tooltip content="Remove chart">
                                      <Button
                                        variant="ghost"
                                        icon={Trash2}
                                        onClick={() => removeChart(sectionIndex, chartIndex)}
                                        size="xs"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      />
                                    </Tooltip>
                                  </div>
                                  {chart.description && (
                                    <p className="text-xs text-gray-600">{chart.description}</p>
                                  )}
                                </div>
                              ))}

                              {section.charts.length === 0 && (
                                <div className="col-span-full text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                  <PieChart className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm">No charts in this {sectionName.toLowerCase()}</p>
                                  <Button 
                                    variant="ghost" 
                                    size="xs" 
                                    onClick={() => setShowChartModal({ sectionIndex })}
                                    className="mt-2"
                                  >
                                    Add Chart
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}

                      {(!sections || sections.length === 0) && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                          <Grid className="w-12 h-12 mx-auto mb-3" />
                          <p className="font-medium">No {sectionName.toLowerCase()}s configured</p>
                          <p className="text-sm mb-4">{sectionName}s organize your charts into logical groups</p>
                          <Button variant="outline" icon={Plus} onClick={addSection} size="sm">
                            Add Your First {sectionName}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Additional Options */}
                <Card gradient hover>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Additional Options</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Data Table</h4>
                        <p className="text-sm text-gray-500">Include a comprehensive data table at the bottom</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.include_table}
                          onChange={(e) => updateConfig({ include_table: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Enhanced Preview Panel */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
                <Badge variant={previewMode ? 'success' : 'default'}>
                  {previewMode ? 'Preview Mode' : 'Edit Mode'}
                </Badge>
              </div>

              <Card className="min-h-96" gradient>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      {config.layout === 'minimal-reports' ? 'Minimal Reports Layout' : 'Jacket Reports Layout'}
                    </h3>
                    <Badge variant="info" size="sm">
                      {config.layout.replace('-', ' ')}
                    </Badge>
                  </div>

                  {/* Preview Content */}
                  <div className="space-y-6">
                    {/* Cards Preview */}
                    {config.cards.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Metric Cards</h4>
                        <div className={`grid gap-3 ${
                          config.cards.length === 1 ? 'grid-cols-1' :
                          config.cards.length === 2 ? 'grid-cols-2' :
                          config.cards.length === 3 ? 'grid-cols-3' :
                          'grid-cols-2'
                        }`}>
                          {config.cards.slice(0, 4).map((card, index) => (
                            <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                              <div className="text-sm font-medium text-blue-900 mb-1">{card}</div>
                              <div className="text-xl font-bold text-blue-600">
                                {(1000 + index * 234).toLocaleString()}
                              </div>
                              <div className="text-xs text-blue-500 flex items-center gap-1">
                                <span>+{(5.2 + index * 1.1).toFixed(1)}%</span>
                                <ArrowRight size={10} className="rotate-[-45deg]" />
                              </div>
                            </div>
                          ))}
                        </div>
                        {config.cards.length > 4 && (
                          <p className="text-xs text-gray-500 mt-2">+{config.cards.length - 4} more cards</p>
                        )}
                      </div>
                    )}

                    {/* Filters Preview */}
                    {config.filters.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
                        <div className="flex flex-wrap gap-2">
                          {config.filters.slice(0, 3).map((filter, index) => (
                            <div key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                              {filter.label}
                            </div>
                          ))}
                          {config.filters.length > 3 && (
                            <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              +{config.filters.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sections Preview */}
                    {sections && sections.length > 0 && (
                      <div className="space-y-4">
                        {sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              {section.title || `${sectionName} ${sectionIndex + 1}`}
                            </h4>
                            {section.charts.length > 0 ? (
                              <div className={`grid gap-3 ${
                                section.charts.length === 1 ? 'grid-cols-1' :
                                'grid-cols-2'
                              }`}>
                                {section.charts.slice(0, 4).map((chart, chartIndex) => (
                                  <div key={chartIndex} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
                                    <div className="text-sm font-medium text-gray-800 mb-2">{chart.title}</div>
                                    <div className="flex items-center justify-center h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded">
                                      <div className="text-3xl">
                                        {chart.type === 'bar' ? '📊' :
                                         chart.type === 'line' ? '📈' :
                                         chart.type === 'scatter' ? '🔸' :
                                         chart.type === 'pie' ? '🥧' :
                                         chart.type === 'area' ? '📉' :
                                         chart.type === 'histogram' ? '📊' :
                                         chart.type === 'heatmap' ? '🔥' : '📊'}
                                      </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                      <Badge variant="success" size="sm">{chart.type}</Badge>
                                      <div className="text-xs text-gray-500">
                                        {chart.x} × {chart.y}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-sm">No charts in this {sectionName.toLowerCase()}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table Preview */}
                    {config.include_table && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Data Table</h4>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-900">Comprehensive Data View</div>
                          </div>
                          <div className="p-4 text-center text-gray-500">
                            <div className="text-sm">Interactive data table will be displayed here</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {config.cards.length === 0 && (!sections || sections.length === 0) && !config.include_table && (
                      <div className="text-center py-12 text-gray-500">
                        <Layers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium">Your Dashboard Preview</p>
                        <p className="text-sm mb-4">Add components to see them appear here</p>
                        <Button variant="outline" onClick={() => setShowQuickStart(true)} size="sm">
                          Use Quick Start
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Add Card Modal */}
      <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)} title="Add Metric Card">
        <div className="space-y-4">
          <Input
            label="Card Name"
            value={newCard}
            onChange={(e) => setNewCard(e.target.value)}
            placeholder="e.g., Total Revenue"
            helperText="Enter a descriptive name for your metric card"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowCardModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCard} disabled={!newCard.trim()}>
              Add Card
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Filter Modal */}
      <Modal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} title="Add Filter">
        <div className="space-y-4">
          <Input
            label="Filter Label"
            value={newFilter.label || ''}
            onChange={(e) => setNewFilter({ ...newFilter, label: e.target.value })}
            placeholder="e.g., Date Range"
          />
          <Input
            label="Filter ID"
            value={newFilter.id || ''}
            onChange={(e) => setNewFilter({ ...newFilter, id: e.target.value })}
            placeholder="e.g., date_filter"
            helperText="Unique identifier for this filter"
          />
          <Select
            label="Filter Type"
            options={filterTypeOptions}
            value={newFilter.type || ''}
            onChange={(value) => setNewFilter({ ...newFilter, type: value as FilterConfig['type'] })}
            placeholder="Select filter type"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddFilter} 
              disabled={!newFilter.label || !newFilter.id || !newFilter.type}
            >
              Add Filter
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Chart Modal */}
      <Modal 
        isOpen={showChartModal !== null} 
        onClose={() => setShowChartModal(null)} 
        title={`Add Chart to ${sectionName} ${(showChartModal?.sectionIndex ?? 0) + 1}`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Chart Title"
              value={newChart.title || ''}
              onChange={(e) => setNewChart({ ...newChart, title: e.target.value })}
              placeholder="e.g., Monthly Sales"
            />
            <Select
              label="Chart Type"
              options={chartTypeOptions}
              value={newChart.type || ''}
              onChange={(value) => setNewChart({ ...newChart, type: value as ChartConfig['type'] })}
              placeholder="Select chart type"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="X-Axis Variable"
              value={newChart.x || ''}
              onChange={(e) => setNewChart({ ...newChart, x: e.target.value })}
              placeholder="e.g., month"
            />
            <Input
              label="Y-Axis Variable"
              value={newChart.y || ''}
              onChange={(e) => setNewChart({ ...newChart, y: e.target.value })}
              placeholder="e.g., sales"
            />
          </div>
          <Input
            label="Description (Optional)"
            value={newChart.description || ''}
            onChange={(e) => setNewChart({ ...newChart, description: e.target.value })}
            placeholder="Brief description of what this chart shows"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowChartModal(null)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={() => showChartModal && handleAddChart(showChartModal.sectionIndex)} 
              disabled={!newChart.title || !newChart.type || !newChart.x || !newChart.y}
            >
              Add Chart
            </Button>
          </div>
        </div>
      </Modal>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  );
};

export default DashboardBuilder;