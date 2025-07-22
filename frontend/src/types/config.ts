export interface ChartConfig {
  type: 'bar' | 'line' | 'scatter' | 'pie' | 'area' | 'histogram' | 'heatmap';
  title: string;
  x: string;
  y: string;
  group_by?: string;
  color?: string;
}

export interface FilterConfig {
  type: 'dropdown' | 'multichoice' | 'date_range' | 'slider' | 'text_box';
  label: string;
  id: string;
  options?: string[];
}

export interface SectionConfig {
  charts: ChartConfig[];
}

export interface LayoutConfig {
  layout: 'minimal-reports' | 'jacket-reports';
  cards: string[];
  filters: FilterConfig[];
  alleys?: SectionConfig[];
  lanes?: SectionConfig[];
  include_table: boolean;
}
